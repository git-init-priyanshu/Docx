import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

export const alt =
  "DocX, an open-source Google Docs alternative with built-in AI commands";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PAPER = "#15120E";
const PAPER_2 = "#1C1813";
const INK = "#F4ECDF";
const MUTED = "#9A8E7E";
const BORDER = "#2C2620";
const CARD = "#1A1611";
const ACCENT = "#60a5fa";
const ACCENT_SOFT = "#242A32";
const LEAF = "#8FAE7B";

export default async function Image() {
  const fontDir = join(process.cwd(), "public/fonts");
  const [regular, semibold] = await Promise.all([
    readFile(join(fontDir, "Inter-Regular.woff")),
    readFile(join(fontDir, "Inter-SemiBold.woff")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: PAPER,
          padding: "64px 72px",
          alignItems: "center",
          gap: 48,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", width: 580 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "6px 14px",
              borderRadius: 999,
              border: `1px solid ${BORDER}`,
              background: CARD,
              color: MUTED,
              fontSize: 17,
              letterSpacing: 2,
              alignSelf: "flex-start",
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: 999,
                background: LEAF,
              }}
            />
            OPEN SOURCE
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 30,
              fontSize: 70,
              fontWeight: 600,
              lineHeight: 1.04,
              letterSpacing: -2.6,
              color: INK,
            }}
          >
            <span>An open-source</span>
            <span>Google Docs</span>
            <span>alternative.</span>
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 24,
              lineHeight: 1.5,
              color: MUTED,
            }}
          >
            A collaborative document editor with built-in AI commands. Real-time
            sync, version history, self-hostable.
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginTop: 44,
              fontSize: 24,
              fontWeight: 600,
              color: INK,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                borderRadius: 10,
                background: INK,
                color: PAPER,
                fontSize: 23,
                fontWeight: 600,
              }}
            >
              D
            </div>
            DocX
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: 428,
            height: 462,
            borderRadius: 14,
            border: `1px solid ${BORDER}`,
            background: CARD,
            overflow: "hidden",
            boxShadow: "0 30px 70px rgba(0, 0, 0, 0.45)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 18px",
              borderBottom: `1px solid ${BORDER}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <div
                style={{
                  width: 11,
                  height: 11,
                  borderRadius: 999,
                  background: "#E36F5C",
                }}
              />
              <div
                style={{
                  width: 11,
                  height: 11,
                  borderRadius: 999,
                  background: "#E5C25A",
                }}
              />
              <div
                style={{
                  width: 11,
                  height: 11,
                  borderRadius: 999,
                  background: "#7BB47A",
                }}
              />
              <div style={{ marginLeft: 10, fontSize: 15, color: MUTED }}>
                readme.docx
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 26,
                  height: 26,
                  borderRadius: 999,
                  background: ACCENT,
                  color: PAPER,
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                P
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 26,
                  height: 26,
                  borderRadius: 999,
                  background: LEAF,
                  color: PAPER,
                  fontSize: 13,
                  fontWeight: 600,
                  marginLeft: -8,
                }}
              >
                M
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              padding: "26px 28px",
              background: PAPER_2,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 29,
                fontWeight: 600,
                letterSpacing: -0.7,
                color: INK,
              }}
            >
              DocX - a quick note
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 14,
                color: MUTED,
                marginTop: 6,
              }}
            >
              draft · saved
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                marginTop: 18,
                fontSize: 19,
                lineHeight: 1.65,
                color: INK,
              }}
            >
              A Google Docs clone with a few AI commands, and somehow it
              actually works.
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                alignSelf: "flex-start",
                marginTop: 20,
                padding: "10px 14px",
                borderRadius: 8,
                border: `1px solid ${BORDER}`,
                background: ACCENT_SOFT,
                fontSize: 17,
                color: INK,
              }}
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke={ACCENT}
                strokeWidth="1.8"
                strokeLinecap="round"
              >
                <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.5 5.5l2 2M16.5 16.5l2 2M5.5 18.5l2-2M16.5 7.5l2-2" />
                <circle cx="12" cy="12" r="2.2" />
              </svg>
              try: &quot;...most of the time.&quot;
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 18px",
              borderTop: `1px solid ${BORDER}`,
              background: CARD,
              fontSize: 15,
              color: MUTED,
            }}
          >
            <div style={{ display: "flex" }}>2 here</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  background: LEAF,
                }}
              />
              saved
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Inter", data: regular, weight: 400, style: "normal" },
        { name: "Inter", data: semibold, weight: 600, style: "normal" },
      ],
    },
  );
}
