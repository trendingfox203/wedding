// Toàn bộ nội dung thiệp cưới tập trung ở đây — sửa nội dung, không cần đụng vào component.
// TODO(couple-info): xác nhận thứ tự chú rể/cô dâu, giờ cưới chính xác, tên+địa chỉ địa điểm.
// Tên đầy đủ lấy từ layer text thật trong Figma ("Lê Duy & Quỳnh Khanh").

import { useLanguage, type Language } from "./LanguageContext";

export const weddingConfigEn = {
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
  tagline: "With love,",
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
    { time: "5:30 PM", label: "Guest Arrival" },
    { time: "6:30 PM", label: "Ceremony" },
    { time: "7:00 PM", label: "Reception" },
  ],
  story: {
    heading: "A Love Story",
  },
  // Khớp Page 5 Figma ("Dresscode" / BLACK ATTIRE).
  dressCode: {
    heading: "Black Tie",
    ladiesText:
      "Ladies: Evening gown in champagne, dusty pink, olive green, taupe, brown, plum noir",
    gentlemenText: "Gentlemen: Black Tie Attire",
  },

  // --- Timeline "A decade of us": khớp frame3 (quá khứ) + Component 14 (tương lai) trong Figma.
  // Click để chuyển giữa 2 trạng thái. 6 ảnh riêng biệt (frame3_p1..p6).
  timeline: {
    heading: "A decade of us",
    past: [
      {
        title: "2015 · Singapore",
        text: "Where our paths first crossed.",
        photo: "/images/frame3_p1.webp",
      },
      {
        title: "2017 · Long distance love",
        text: "Different cities. Different time zones. Always one destination.",
        photo: "/images/frame3_p2.webp",
      },
      {
        title: "2024 · Barcelona",
        text: "A new city. A new chapter. Pursuing our MBA together.",
        photo: "/images/frame3_p3.webp",
      },
    ],
    future: [
      {
        title: "The Proposal",
        text: "One unforgettable “Yes.”",
        photo: "/images/frame3_p4.webp",
      },
      {
        title: "Tea Ceremony · 30.04.2026",
        text: "Our two families became one.",
        photo: "/images/frame3_p5.webp",
      },
      {
        title: "The Decade · 10.10.2026",
        text: "Where forever begins.",
        photo: "/images/frame3_p6.webp",
      },
    ],
  },

  // --- Gallery carousel: khớp frame4.
  gallery: {
    quote:
      "We have shared hundreds of flights and explored countless places, but the greatest destination has always been having each other",
    signatureImage: "/images/gallery-signature.png",
    // photos[0] is the fixed left-frame portrait; the rest are the right
    // carousel, in the order the source photos were added.
    photos: [
      "/images/gallery-01.webp",
      "/images/gallery-02.webp",
      "/images/gallery-03.webp",
      "/images/gallery-04.webp",
      "/images/gallery-05.webp",
      "/images/gallery-06.webp",
      "/images/gallery-07.webp",
      "/images/gallery-08.webp",
      "/images/gallery-09.webp",
      "/images/gallery-10.webp",
      "/images/gallery-11.webp",
      "/images/gallery-12.webp",
      "/images/gallery-13.webp",
      "/images/gallery-14.webp",
    ],
  },

  // --- FAQ: nội dung thật từ tài liệu "Duy Khanh Website - FAQ & Registeration Form" ---
  rsvpDeadlineDisplay: "15 September 2026",
  contactEmail: "team@curatedbyaiai.com",
  faqs: [
    {
      question: "When is the RSVP deadline?",
      answer: "We kindly ask that you RSVP by 15 September 2026.",
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
      "https://script.google.com/macros/s/AKfycbxNPvIM5mNBgQE4-KPI3mHCAl8o7XDA7hl1U9D5w7JWUW1fMXXqSRC7untf0ChGJZwL/exec",
    guestCountOptions: [1, 2],
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

export type WeddingConfig = typeof weddingConfigEn;

// Bản tiếng Việt — thay từng dòng có tiền tố "TODO(vi):" bằng nội dung thật
// của bạn (xoá luôn tiền tố đó). Các trường không cần dịch (tên, ngày giờ,
// link, đường dẫn ảnh, tuỳ chọn RSVP...) được kế thừa nguyên vẹn từ bản
// tiếng Anh qua spread `...weddingConfigEn`, không cần khai lại.
const t = (viPlaceholder: string) => `TODO(vi): dịch — ${viPlaceholder}`;

export const weddingConfigVi: WeddingConfig = {
  ...weddingConfigEn,
  // openInvitationLabel: t(weddingConfigEn.openInvitationLabel),
  // saveTheDateLabel: t(weddingConfigEn.saveTheDateLabel),
  closing: {
    heading: "HẸN GẶP LẠI MỌI NGƯỜI",
    subheading: "Vào ngày",
  },
  venue: {
    name: "GEM CENTER",
    room: "Sảnh Castor",
    address: "Số 8 Nguyễn Bỉnh Khiêm, Phường Sài Gòn, TP. Hồ Chí Minh",
    mapUrl: "https://maps.google.com",
  },
   schedule: [
    { time: "5:30 PM", label: "ĐÓN KHÁCH" },
    { time: "6:30 PM", label: "LỄ CƯỚI" },
    { time: "7:00 PM", label: "KHAI TIỆC" },
  ],
  dressCode: {
    heading: "Trang trọng",
    ladiesText:"Quý cô: Đầm dạ hội màu kem, hồng đất, xanh olive, xám, nâu, tím mận",
    gentlemenText:"Quý ông: Vest hoặc tuxedo đen",
  },
  timeline: {
    heading: "A decade of us",
    past: [
      {
        title: "2015 · Singapore",
        text: "Nơi lần đầu gặp gỡ.",
        photo: "/images/frame3_p1.webp",
      },
      {
        title: "2017 · Yêu xa",
        text: "Dù sống ở hai thành phố, theo hai múi giờ khác nhau, cả hai vẫn luôn hướng về nhau.",
        photo: "/images/frame3_p2.webp",
      },
      {
        title: "2024 · Barcelona",
        text: "Mở ra một chương mới, nơi hoài bão và tình yêu song hành, để giấc mơ MBA không còn là hành trình đơn độc",
        photo: "/images/frame3_p3.webp",
      },
    ],
    future: [
      {
        title: "Lời Cầu Hôn",
        text: 'Khoảnh khắc "Đồng ý" mở ra một đời bên nhau.',
        photo: "/images/frame3_p4.webp",
      },
      {
        title: "30.04.2026 · Lễ Vu Quy",
        text: "Chén trà nghi ngút khói,\n Hai họ nên duyên,\n Một nhà chung bóng.",
        photo: "/images/frame3_p5.webp",
      },
      {
        title: "Một Thập Kỷ · 10.10.2026",
        text: "Ngày một thập kỷ yêu thương đón một cột mốc mới.",
        photo: "/images/frame3_p6.webp",
      },
    ],
  },
  gallery: {
    ...weddingConfigEn.gallery,
    quote: "Chúng tôi đã cùng nhau ngồi trên hàng trăm chuyến bay, khám phá biết bao vùng đất mới, để rồi nhận ra rằng điểm đến đẹp nhất không phải là một nơi nào đó, mà là nơi chúng tôi luôn song hành cùng nhau",
  },
  rsvpDeadlineDisplay:"15 tháng 9 2026",
   faqs: [
    {
      question: "Hạn cuối xác nhận tham dự là khi nào?",
      answer: "Vui lòng xác nhận tham dự trước ngày 15 tháng 09 năm 2026.",
    },
    {
      question: "Tôi có thể đi cùng một người nữa không?",
      answer: "Do số lượng chỗ ngồi có hạn, mỗi thiệp mời chỉ có thể đăng ký thêm một khách đi cùng. Quý khách vui lòng điền thông tin của người đi cùng trong mẫu xác nhận tham dự. Chúng tôi chân thành cảm ơn sự thông cảm của Quý khách.",
    },
    {
      question: "Trẻ em có thể tham dự không?",
      answer: "Do tính chất trang trọng của buổi tiệc, chúng tôi rất tiếc không thể tiếp đón trẻ em. Chân thành cảm ơn sự thấu hiểu của Quý khách.",
    },
    {
      question: "Địa điểm tổ chức có chỗ đậu xe không?",
      answer: "Tại GEM Center có bãi đậu xe. Tuy nhiên, chúng tôi khuyến khích quý khách đi taxi hoặc dịch vụ xe công nghệ để có thể thoải mái tận hưởng buổi tiệc.",
    },
    {
      question: "Có thể hỗ trợ các yêu cầu đặc biệt về chế độ ăn uống không?",
      answer: "Quý khách vui lòng ghi rõ các yêu cầu về chế độ ăn uống khi gửi xác nhận tham dự. Chúng tôi sẽ cố gắng để đáp ứng yêu cầu của Quý khách.",
    },
    {
      question: "Tôi có thể thay đổi thông tin sau khi đã xác nhận tham dự không?",
      answer: "Trong trường hợp kế hoạch có thay đổi, Quý khách vui lòng liên hệ với chúng tôi sớm nhất có thể hoặc trước ngày diễn ra sự kiện ít nhất 7 ngày.",
    },
    {
      question: "Tôi có thể liên hệ với ai nếu cần hỗ trợ thêm?",
      answer: "Nếu cần thêm thông tin hoặc hỗ trợ, Quý khách vui lòng liên hệ đội ngũ Wedding Planner của chúng tôi qua email team@curatedbyaiai.com.",
    },
  ],
  //   question: t(item.question),
  //   answer: t(item.answer),
  // })),
  rsvp: {
    ...weddingConfigEn.rsvp,
    successMessage: {
      heading: "Cảm ơn",
      subheading: t(weddingConfigEn.rsvp.successMessage.subheading),
      body: t(weddingConfigEn.rsvp.successMessage.body),
    },
    declineMessage: {
      heading:"Cảm ơn",
      subheading: "ĐÃ PHẢN HỒI",
      body: t(weddingConfigEn.rsvp.declineMessage.body),
    },
  },
};

export function getWeddingConfig(lang: Language): WeddingConfig {
  return lang === "vi" ? weddingConfigVi : weddingConfigEn;
}

// One-line access from any client component: `const weddingConfig = useWeddingConfig();`
export function useWeddingConfig(): WeddingConfig {
  const { language } = useLanguage();
  return getWeddingConfig(language);
}

// weddingDateISO is identical in both languages, so this needs no language
// input — DD.MM.YYYY is already language-neutral (no month names).
export function formatWeddingDateShort() {
  const date = new Date(weddingConfigEn.weddingDateISO);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}.${month}.${date.getFullYear()}`;
}
