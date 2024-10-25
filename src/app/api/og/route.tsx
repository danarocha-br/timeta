import { ImageResponse } from "next/og";

export async function GET() {
  return new ImageResponse(
    (
      <img
        alt="Timeta"
        src="https://res.cloudinary.com/danarocha/image/upload/v1729873097/timeta-og.png"
      />
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
