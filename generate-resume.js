const {
  Document, Packer, Paragraph, TextRun, TabStopType, TabStopLeader,
  AlignmentType, BorderStyle, Table, TableRow, TableCell,
  WidthType, HeadingLevel, convertInchesToTwip, LevelFormat,
  UnderlineType, ShadingType
} = require("docx");
const fs = require("fs");

const FONT = "Times New Roman";
const BLACK = "000000";
const BLUE  = "1155CC";

const pt = (n) => n * 2; // half-points

// ── helpers ─────────────────────────────────────────────────────────────────

function run(text, opts = {}) {
  return new TextRun({ text, font: FONT, color: BLACK, ...opts });
}

function blueLink(text) {
  return new TextRun({ text, font: FONT, color: BLUE, underline: { type: UnderlineType.SINGLE, color: BLUE } });
}

function boldRun(text) {
  return run(text, { bold: true });
}

function emptyLine(sizeHalfPt = 12) {
  return new Paragraph({
    children: [new TextRun({ text: "", font: FONT, size: sizeHalfPt })],
    spacing: { before: 0, after: 0 },
  });
}

// Section heading with bottom border (like the image's horizontal rules)
function sectionHeading(text) {
  return new Paragraph({
    children: [new TextRun({ text: text.toUpperCase(), font: FONT, bold: true, size: pt(11), allCaps: true, color: BLACK })],
    spacing: { before: pt(7), after: pt(3) },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 6, color: BLACK, space: 1 },
    },
  });
}

// ── Skills rows ──────────────────────────────────────────────────────────────

function skillRow(label, value) {
  return new Paragraph({
    children: [
      boldRun(label + "  "),
      run(value),
    ],
    spacing: { before: 0, after: pt(1.5) },
  });
}

// ── Project helpers ──────────────────────────────────────────────────────────

function projectHeader(title, subtitle, links) {
  // links: array of strings like "Live Site", "Client", "Server"
  const children = [
    boldRun(title + " "),
    run("(" + subtitle + ")", { italics: true }),
  ];

  // right-aligned links via a right tab stop
  children.push(new TextRun({ text: "\t", font: FONT }));
  links.forEach((l, i) => {
    if (i > 0) children.push(run("  |  "));
    children.push(blueLink(l));
  });

  return new Paragraph({
    children,
    tabStops: [{ type: TabStopType.RIGHT, position: convertInchesToTwip(7.3) }],
    spacing: { before: pt(5), after: 0 },
  });
}

function projectDesc(text) {
  return new Paragraph({
    children: [run(text)],
    spacing: { before: pt(1.5), after: 0 },
  });
}

function techLine(tech) {
  return new Paragraph({
    children: [boldRun("Technologies Used: "), run(tech)],
    spacing: { before: pt(2), after: 0 },
  });
}

function bullet(text) {
  return new Paragraph({
    children: [run(text)],
    bullet: { level: 0 },
    spacing: { before: 0, after: pt(1.5) },
  });
}

// ── Course row ───────────────────────────────────────────────────────────────

function courseRow(name, provider, certText) {
  // 3-column with tab stops
  const children = [run(name), new TextRun({ text: "\t", font: FONT }), run(provider)];
  if (certText) {
    children.push(new TextRun({ text: "\t", font: FONT }));
    children.push(blueLink(certText));
  }
  return new Paragraph({
    children,
    tabStops: [
      { type: TabStopType.LEFT,  position: convertInchesToTwip(3.2) },
      { type: TabStopType.RIGHT, position: convertInchesToTwip(7.3) },
    ],
    spacing: { before: 0, after: pt(2) },
  });
}

// ── Document ─────────────────────────────────────────────────────────────────

const doc = new Document({
  numbering: {
    config: [
      {
        reference: "default-bullet",
        levels: [{
          level: 0,
          format: LevelFormat.BULLET,
          text: "\u2022",
          alignment: AlignmentType.LEFT,
          style: {
            paragraph: { indent: { left: convertInchesToTwip(0.25), hanging: convertInchesToTwip(0.15) } },
          },
        }],
      },
    ],
  },
  styles: {
    default: {
      document: {
        run: { font: FONT, size: pt(10.5), color: BLACK },
        paragraph: { spacing: { before: 0, after: 0 } },
      },
    },
  },
  sections: [{
    properties: {
      page: {
        margin: {
          top:    convertInchesToTwip(0.55),
          bottom: convertInchesToTwip(0.5),
          left:   convertInchesToTwip(0.6),
          right:  convertInchesToTwip(0.6),
        },
      },
    },
    children: [

      // ── HEADER ────────────────────────────────────────────────────────────
      // Two-column table: name+title left | contact right
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
          top:          { style: BorderStyle.NONE },
          bottom:       { style: BorderStyle.NONE },
          left:         { style: BorderStyle.NONE },
          right:        { style: BorderStyle.NONE },
          insideH:      { style: BorderStyle.NONE },
          insideV:      { style: BorderStyle.NONE },
        },
        rows: [new TableRow({
          children: [
            // Left cell — name & title
            new TableCell({
              width: { size: 55, type: WidthType.PERCENTAGE },
              borders: { top: {style:BorderStyle.NONE}, bottom:{style:BorderStyle.NONE}, left:{style:BorderStyle.NONE}, right:{style:BorderStyle.NONE} },
              children: [
                new Paragraph({
                  children: [new TextRun({ text: "Md Muhib Ur Rahman Mahin", font: FONT, bold: true, size: pt(20), color: BLACK })],
                  spacing: { before: 0, after: pt(1) },
                }),
                new Paragraph({
                  children: [run("Full Stack Developer", { size: pt(10.5) })],
                  spacing: { before: 0, after: 0 },
                }),
              ],
            }),
            // Right cell — contact info
            new TableCell({
              width: { size: 45, type: WidthType.PERCENTAGE },
              borders: { top:{style:BorderStyle.NONE}, bottom:{style:BorderStyle.NONE}, left:{style:BorderStyle.NONE}, right:{style:BorderStyle.NONE} },
              children: [
                new Paragraph({ children: [run("\u2709 muhibmahin@email.com")], alignment: AlignmentType.RIGHT, spacing: {before:0,after:pt(1)} }),
                new Paragraph({ children: [run("\uD83D\uDCDE +8801XXXXXXXXX (WhatsApp)")], alignment: AlignmentType.RIGHT, spacing: {before:0,after:pt(1)} }),
                new Paragraph({ children: [run("\uD83D\uDCCD Sylhet, Bangladesh.")], alignment: AlignmentType.RIGHT, spacing: {before:0,after:pt(1)} }),
                new Paragraph({
                  children: [blueLink("LinkedIn"), run("  "), blueLink("GitHub"), run("  "), blueLink("Portfolio")],
                  alignment: AlignmentType.RIGHT,
                  spacing: { before: 0, after: 0 },
                }),
              ],
            }),
          ],
        })],
      }),

      // ── SKILLS ────────────────────────────────────────────────────────────
      sectionHeading("Skills"),
      skillRow("Frontend:", "HTML, CSS, JavaScript, TypeScript, React.js, Next.js, Redux, Tailwind CSS"),
      skillRow("Backend:", "Node.js, Express.js, Firebase, JSON Web Token (JWT), RESTful APIs"),
      skillRow("Database & ORM:", "MongoDB, Mongoose, SQL, PostgreSQL, Prisma ORM"),
      skillRow("Tools:", "Git, GitHub, Cursor, VS Code, Vercel, Netlify, Postman"),
      skillRow("Interpersonal Skills:", "Analytical Problem-solving, Team Collaboration, Quick Learning, Time Management"),

      // ── PROJECTS ──────────────────────────────────────────────────────────
      sectionHeading("Projects"),

      // Planora
      projectHeader("Planora", "Full-Stack Event Management System", ["Live Site", "Client", "Server"]),
      projectDesc("A complete full-stack event planning platform designed to feature dynamic dashboards and custom brand controls."),
      techLine("MongoDB, Express.js, React.js, Node.js, Tailwind CSS."),
      bullet("Implemented secure multi-image upload functionality for fast and clean gallery management."),
      bullet("Designed a fully customized user interface featuring specific brand-colored backgrounds and theme-based custom selections."),
      bullet("Built real-time control features allowing event managers to create, delete, and view comprehensive dashboard analytics."),

      // MediStore
      projectHeader("MediStore", "Mobile-First Online Pharmacy Platform", ["Live Site", "Client", "Server"]),
      projectDesc("A fast, phone-first web application designed for seamlessly searching, browsing, and ordering medicines safely."),
      techLine("Next.js, TypeScript, PostgreSQL, Prisma ORM, Tailwind CSS."),
      bullet("Configured a secure Multi-Role system with distinct dashboard interfaces for Customers, Verified Sellers, and Admin panels."),
      bullet("Optimized medicine database search and filtering speeds using advanced index-based query structures."),
      bullet("Integrated strict transactional safety layers using database cascading deletes to protect purchase logs and historical integrity."),

      // Vehicle Rental
      projectHeader("Vehicle Rental System", "Backend Architecture Project", ["Live Site", "Source Code"]),
      projectDesc("A robust and modular backend management system designed to track vehicle inventory, real-time availability, and bookings."),
      techLine("Node.js, TypeScript, PostgreSQL, Prisma ORM."),
      bullet("Built complete CRUD endpoints with secure error parsing to manage extensive vehicle renting lifecycles."),
      bullet("Applied strict relational structures with TypeScript checking to ensure bug-free transaction handshakes."),

      // ── EDUCATION ─────────────────────────────────────────────────────────
      sectionHeading("Education"),
      new Paragraph({
        children: [
          boldRun("BSc. in Computer Science and Engineering (CSE)"),
          new TextRun({ text: "\t", font: FONT }),
          run("Batch 60  |  Ongoing"),
        ],
        tabStops: [{ type: TabStopType.RIGHT, position: convertInchesToTwip(7.3) }],
        spacing: { before: pt(2), after: pt(1.5) },
      }),
      new Paragraph({
        children: [run("Metropolitan University, Sylhet, Bangladesh.")],
        spacing: { before: 0, after: 0 },
      }),

      // ── COURSES ───────────────────────────────────────────────────────────
      sectionHeading("Courses"),
      courseRow("Next Level Web Development", "Programming Hero", "Certificate"),
      courseRow("Complete Web Development Bootcamp", "Programming Hero", "Certificate"),
      courseRow("MU CP Booster Program (Competitive Programming & Algorithms)", "Metropolitan University", ""),

      // ── LANGUAGES ─────────────────────────────────────────────────────────
      sectionHeading("Languages"),
      new Paragraph({
        children: [run("Fluent in Bengali (native), and proficient in English (professional working proficiency).")],
        spacing: { before: pt(2), after: 0 },
      }),
    ],
  }],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync("Muhib_Mahin_Resume.docx", buffer);
  console.log("✅  Muhib_Mahin_Resume.docx created successfully.");
});
