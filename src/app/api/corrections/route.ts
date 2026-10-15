import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { supabase } from '@/lib/supabase';

// Basic in-memory rate limiting by IP
const ipSubmissions = new Map<string, { count: number; resetAt: number }>();

export async function POST(request: Request) {
  try {
    const clientIp =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    const now = Date.now();

    // ── 15a. Rate limit: max 5 submissions per hour per IP ────────────────
    const limitData = ipSubmissions.get(clientIp);
    if (limitData && limitData.resetAt > now) {
      if (limitData.count >= 5) {
        return NextResponse.json(
          { error: 'Too many correction submissions from this IP. Please try again later.' },
          { status: 429 }
        );
      }
      limitData.count += 1;
    } else {
      ipSubmissions.set(clientIp, { count: 1, resetAt: now + 3_600_000 });
    }

    const body = await request.json();
    const {
      stationCode,
      stationName,
      trainNumber,
      trainName,
      fromStation,
      toStation,
      arrivalTime,
      departureTime,
      note,
      honeypot,     // Anti-bot dummy field — never shown in real UI
      submittedAt,  // Client-side timestamp to detect instant bot submissions
    } = body;

    // ── 15b. Honeypot check ───────────────────────────────────────────────
    // Bots fill every field; real users leave the hidden honeypot blank
    if (honeypot) {
      // Silently accept so bots don't know they were caught
      return NextResponse.json({ success: true, message: 'Submitted for moderation.' });
    }

    // ── 15c. Timing check: reject submissions faster than 2 seconds ───────
    // Legitimate users take at least a few seconds to read and fill a form
    if (submittedAt && typeof submittedAt === 'number') {
      const elapsedMs = now - submittedAt;
      if (elapsedMs < 2000) {
        return NextResponse.json(
          { error: 'Submission rejected. Please review the form before submitting.' },
          { status: 400 }
        );
      }
    }

    // ── 15d. Basic input validation ───────────────────────────────────────
    if (!stationCode || !trainNumber) {
      return NextResponse.json(
        { error: 'Station code and Train number are required.' },
        { status: 400 }
      );
    }

    // Sanitize: strip control characters and limit field lengths
    const sanitize = (val: unknown, maxLen = 100): string | null => {
      if (typeof val !== 'string') return null;
      return val.replace(/[\x00-\x1F\x7F]/g, '').trim().slice(0, maxLen) || null;
    };

    let correctionId: any = null;
    try {
      const correction = await prisma.correction.create({
        data: {
          stationCode: stationCode.toUpperCase().trim().slice(0, 10),
          stationName: sanitize(stationName),
          trainNumber: trainNumber.trim().slice(0, 10),
          trainName: sanitize(trainName),
          fromStation: sanitize(fromStation),
          toStation: sanitize(toStation),
          arrivalTime: sanitize(arrivalTime, 10),
          departureTime: sanitize(departureTime, 10),
          note: sanitize(note, 500),
          status: 'pending',
          ipHash: clientIp,
        },
      });
      correctionId = correction.id;
    } catch (e) {
      // Prisma failed (e.g. SQLite read-only / missing on Vercel) -> save to Supabase
      const { data, error } = await supabase.from('corrections').insert([
        {
          station_code: stationCode.toUpperCase().trim().slice(0, 10),
          station_name: sanitize(stationName),
          train_number: trainNumber.trim().slice(0, 10),
          train_name: sanitize(trainName),
          from_station: sanitize(fromStation),
          to_station: sanitize(toStation),
          arrival_time: sanitize(arrivalTime, 10),
          departure_time: sanitize(departureTime, 10),
          note: sanitize(note, 500),
          status: 'pending',
          ip_hash: clientIp,
        },
      ]).select('id').single();

      if (!error && data) {
        correctionId = data.id;
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Correction submitted for admin review.',
      id: correctionId || Date.now(),
    });
  } catch (error) {
    console.error('Error saving correction:', error);
    return NextResponse.json(
      { error: 'Internal server error while saving correction.' },
      { status: 500 }
    );
  }
}
