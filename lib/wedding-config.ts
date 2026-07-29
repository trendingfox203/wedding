// Toàn bộ nội dung thiệp cưới tập trung ở đây — sửa nội dung, không cần đụng vào component.
// TODO(couple-info): xác nhận thứ tự chú rể/cô dâu, giờ cưới chính xác, tên+địa chỉ địa điểm.
// Tên đầy đủ lấy từ layer text thật trong Figma ("Lê Duy & Quỳnh Khanh").

export const weddingConfig = {
  groom: {
    fullName: "Le Duy",
    shortName: "Duy",
  },
  bride: {
    fullName: "Quynh Khanh",
    shortName: "Khanh",
  },
  // Khớp ảnh Hero Figma: "10th OCTOBER 2026". Giờ tạm để 17:00 — cần xác nhận giờ thật cho CountdownSection.
  weddingDateISO: "2026-10-10T17:00:00+07:00",
  weddingDateDisplay: {
    day: "10",
    ordinal: "th",
    month: "October",
    year: "2026",
  },
  tagline: "With love",
  greeting: "Gia đình và bạn thân mến",
  openInvitationLabel: "Open Invitation",
  saveTheDateLabel: "Save the Date",
  // Khớp frame9: section đóng "Until We Meet Again".
  closing: {
    heading: "Until We Meet Again",
    subheading: "See you on",
  },
  city: "Ho Chi Minh City",
  // Khớp Page 18 Figma ("The Details" / GEM CENTER).
  venue: {
    name: "GEM CENTER",
    room: "Ballroom Castor",
    address: "8 Nguyen Binh Khiem St., Saigon Ward, Ho Chi Minh City, Vietnam",
    mapUrl: "https://maps.google.com",
  },
  schedule: [
    { time: "6:00 PM", label: "Guest Arrival" },
    { time: "6:30 PM", label: "Ceremony" },
    { time: "7:00 PM", label: "Reception" },
  ],
  story: {
    heading: "A Love Story",
    paragraphs: [
      "Đây là đoạn giới thiệu ngắn về câu chuyện tình yêu của hai bạn — thay bằng nội dung thật.",
      "Có thể thêm một đoạn thứ hai kể về kỷ niệm đáng nhớ hoặc lời ngỏ gửi đến khách mời.",
    ],
  },
  // Khớp Page 5 Figma ("Dresscode" / BLACK ATTIRE).
  dressCode: {
    heading: "Black Tie",
    ladiesText:
      "For Ladies: Champagne, Pink, Muted Green, Brown, or Dark Red Dresses",
    gentlemenText: "For Gentlemen: Black Tie Attire",
  },

  // --- Timeline "A decade of us": khớp frame3 (quá khứ) + Component 14 (tương lai) trong Figma.
  // Click để chuyển giữa 2 trạng thái, dùng chung 3 ảnh.
  timeline: {
    heading: "A decade of us",
    past: [
      {
        title: "2015 · Singapore",
        text: "Where our paths first crossed.",
        photo: "/images/timeline-2015-v2.jpg",
      },
      {
        title: "2017 · Long distance love",
        text: "Different cities. Different time zones. Always one destination.",
        photo: "/images/timeline-2017-v2.jpg",
      },
      {
        title: "2024 · Barcelona",
        text: "A new city. A new chapter. Pursuing our MBA together.",
        photo: "/images/timeline-2024-v2.jpg",
      },
    ],
    future: [
      {
        title: "The Proposal",
        text: "One unforgettable “Yes.”",
        photo: "/images/timeline-2015-v2.jpg",
      },
      {
        title: "30.04.2026",
        text: "Tea Ceremony — our two families became one.",
        photo: "/images/timeline-2017-v2.jpg",
      },
      {
        title: "The Decade · 10.10.2026",
        text: "The Tea Ceremony marked the moment two families became one.",
        photo: "/images/timeline-2024-v2.jpg",
      },
    ],
  },

  // --- Gallery carousel: khớp frame4.
  gallery: {
    quote:
      "We have shared hundreds of flights and explored countless places, but the greatest destination has always been having each other",
    signatureImage: "/images/gallery-signature.png",
    photos: ["/images/frame4_p1.webp", "/images/frame4_p2.webp"],
  },

  // --- FAQ: nội dung thật từ tài liệu "Duy Khanh Website - FAQ & Registeration Form" ---
  rsvpDeadlineDisplay: "30 August 2026",
  contactEmail: "team@curatedbyaiai.com",
  faqs: [
    {
      question: "When is the RSVP deadline?",
      answer: "We kindly ask that you RSVP by 30 August 2026.",
    },
    {
      question: "May I bring a plus-one?",
      answer:
        "As space is limited, we are only able to accommodate one additional guest per invitation. Please indicate your plus one in the registration form. We sincerely appreciate your kind understanding.",
    },
    {
      question: "Are children welcome?",
      answer:
        "Due to the nature of the event, we kindly invite you to join us for an adults-only celebration. We truly appreciate your understanding and thank you for making the necessary arrangements.",
    },
    {
      question: "Is there a gift registry?",
      answer:
        "Your presence at our celebration is the greatest gift of all. Should you wish to give something, monetary gifts are customary in Vietnamese tradition as they are considered lucky wishes for the couple and would be received with sincere appreciation.",
    },
    {
      question: "Is parking available?",
      answer:
        "Parking is available at the venue. However, for your comfort and convenience, we recommend using a ride-hailing service (Grab) or taxi.",
    },
    {
      question: "Can dietary requirements be accommodated?",
      answer:
        "Please kindly include any dietary requirements when submitting your RSVP. We will do our very best to accommodate your needs.",
    },
    {
      question: "May I change my RSVP after submitting it?",
      answer:
        "Should your plans change, please kindly contact us at your earliest convenience or at least 7 days in advance so we may update your RSVP accordingly.",
    },
    {
      question: "Who may I contact with further questions?",
      answer:
        "For any further assistance, please feel free to contact our Wedding Planner at team@curatedbyaiai.com",
    },
  ],

  // --- RSVP form: cấu trúc field thật từ tài liệu ---
  rsvp: {
    // Web App URL sau khi deploy scripts/apps-script.gs lên Google Apps Script.
    endpoint:
      "https://script.google.com/macros/s/AKfycbyL2t4bWYx1DrJioe7YOK9JizjtfGkscF1I5qKXrkMl9-ASRVzGwOKagybc0WDouPrY/exec",
    guestCountOptions: [1, 2, 3, 4, 5],
    successMessage: {
      heading: "Thank you",
      subheading: "For your RSVP",
      body: "We are delighted that you will be joining us and look forward to celebrating together.",
    },
    declineMessage: {
      heading: "Thank you",
      subheading: "Letting us know",
      body: "While we will miss having you with us, we completely understand and hope to see you soon.",
    },
  },
};

export function formatWeddingDateShort() {
  const date = new Date(weddingConfig.weddingDateISO);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}/${date.getFullYear()}`;
}

export type WeddingConfig = typeof weddingConfig;
