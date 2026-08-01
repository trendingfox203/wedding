// Component-level UI chrome text (headings, labels, buttons, aria-labels,
// validation/error messages) that isn't part of the wedding *content* in
// wedding-config.ts — generic enough that both languages are filled in
// directly here rather than left as TODOs for the user.
//
// Note: the RSVP "Joyfully accepts" / "Regretfully declines" values are
// deliberately NOT here — they're the literal value submitted to the
// Google Sheet backend, so they stay fixed English strings in RSVPForm.tsx
// regardless of display language. `attendingAcceptLabel`/`attendingDeclineLabel`
// below are only the on-screen text for those same two radio options.
import { useLanguage } from "./LanguageContext";

type UiStrings = {
  hero: {
    loveStory: string;
  };
  countdown: {
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
  };
  saveTheDate: {
    the: string;
    decade: string;
    addToCalendarAria: string;
    openInBrowserHint: string;
  };
  inAppBrowser: {
    openInBrowserBanner: string;
  };
  gallery: {
    previousAria: string;
    nextAria: string;
  };
  details: {
    theDetails: string;
    dresscode: string;
    dresscodeIllustrationAlt: string;
    swatchesAlt: string;
  };
  faq: {
    frequently: string;
    questions: string;
  };
  rsvp: {
    kindly: string;
    rsvp: string;
    deadlineNotice: (date: string) => string;
    reminder: string;
    closeAria: string;
    attendingLegend: string;
    attendingAcceptLabel: string;
    attendingDeclineLabel: string;
    fullNameLabel: string;
    fullNameRequired: string;
    phoneLabel: string;
    phoneRequired: string;
    emailLabel: string;
    emailRequired: string;
    guestCountLabel: string;
    guestNamesLabel: string;
    dietaryLabel: string;
    submitError: (email: string) => string;
    sending: string;
    confirm: string;
  };
};

const uiStringsEn: UiStrings = {
  hero: {
    loveStory: "A Love Story",
  },
  countdown: {
    days: "Days",
    hours: "Hours",
    minutes: "Minutes",
    seconds: "Seconds",
  },
  saveTheDate: {
    the: "The",
    decade: "DECADE",
    addToCalendarAria: "Add wedding day to calendar",
    openInBrowserHint:
      'Please tap ⋯ (or the share icon) in the corner and choose "Open in Browser" to save this to your Calendar.',
  },
  inAppBrowser: {
    openInBrowserBanner:
      'To view the full invitation, please tap ⋯ (or the share icon) in the corner and choose "Open in Browser".',
  },
  gallery: {
    previousAria: "Previous photo",
    nextAria: "Next photo",
  },
  details: {
    theDetails: "The Details",
    dresscode: "Dresscode",
    dresscodeIllustrationAlt: "Guests in the wedding's dress code palette",
    swatchesAlt: "Dress code fabric swatches",
  },
  faq: {
    frequently: "Frequently Asked",
    questions: "Questions",
  },
  rsvp: {
    kindly: "Kindly",
    rsvp: "RSVP",
    deadlineNotice: (date: string) => `Please RSVP before ${date}`,
    reminder:
      "We kindly ask that you confirm your attendance before the RSVP deadline.\n Your response will help us prepare a wonderful celebration for everyone.",
    closeAria: "Close",
    attendingLegend: "Will you be attending?",
    attendingAcceptLabel: "Joyfully accepts",
    attendingDeclineLabel: "Regretfully declines",
    fullNameLabel: "Full Name",
    fullNameRequired: "Please enter your full name",
    phoneLabel: "Phone Number",
    phoneRequired: "Please enter your phone number",
    emailLabel: "Email",
    emailRequired: "Please enter your email",
    guestCountLabel: "How many guests will attend?",
    guestNamesLabel: "Guest Name(s)",
    dietaryLabel: "Dietary Requirements",
    submitError: (email: string) =>
      `There was an error submitting your RSVP. Please try again or contact us at ${email}.`,
    sending: "Sending...",
    confirm: "Confirm",
  },
};

const uiStringsVi: UiStrings = {
  hero: {
    loveStory: "A Love Story",
  },
  countdown: {
    days: "Ngày",
    hours: "Giờ",
    minutes: "Phút",
    seconds: "Giây",
  },
  saveTheDate: {
    the: "The",
    decade: "DECADE",
    addToCalendarAria: "Lưu ngày cưới vào lịch",
    openInBrowserHint:
      'Vui lòng nhấn biểu tượng ⋯ (hoặc chia sẻ) ở góc màn hình và chọn "Mở bằng trình duyệt" để lưu vào Lịch.',
  },
  inAppBrowser: {
    openInBrowserBanner:
      'Để xem thiệp mời đầy đủ, vui lòng nhấn ⋯ (hoặc biểu tượng chia sẻ) ở góc màn hình và chọn "Mở bằng trình duyệt".',
  },
  gallery: {
    previousAria: "Ảnh trước",
    nextAria: "Ảnh sau",
  },
  details: {
    theDetails: "Chi tiết sự kiện",
    dresscode: "Trang phục",
    dresscodeIllustrationAlt: "Khách mời trong tông màu trang phục của tiệc cưới",
    swatchesAlt: "Bảng màu vải gợi ý trang phục",
  },
  faq: {
    frequently: "Câu Hỏi",
    questions: "Thường Gặp",
  },
  rsvp: {
    kindly: "Xác nhận",
    rsvp: "THAM DỰ",
    deadlineNotice: (date: string) => `Vui lòng xác nhận tham dự trước ngày ${date}`,
    reminder:
      "Kính mong Quý khách xác nhận tham dự trước thời hạn RSVP.\n Sự phản hồi của Quý khách sẽ giúp chúng tôi chuẩn bị chu đáo cho ngày trọng đại.",
    closeAria: "Đóng",
    attendingLegend: "Vui lòng xác nhận tham dự",
    attendingAcceptLabel: "Tôi sẽ tham dự",
    attendingDeclineLabel: "Rất tiếc không thể có mặt",
    fullNameLabel: "Họ & Tên",
    fullNameRequired: "Vui lòng nhập họ tên",
    phoneLabel: "Số điện thoại",
    phoneRequired: "Vui lòng nhập số điện thoại",
    emailLabel: "Email",
    emailRequired: "Vui lòng nhập email",
    guestCountLabel: "Số lượng khách tham dự",
    guestNamesLabel: "Họ và tên khách đi cùng",
    dietaryLabel: "Yêu cầu ăn chay / dị ứng (nếu có)",
    submitError: (email: string) =>
      `Có lỗi khi gửi RSVP. Vui lòng thử lại hoặc liên hệ ${email}.`,
    sending: "Đang gửi...",
    confirm: "Xác nhận",
  },
};

export function getUiStrings(lang: "en" | "vi") {
  return lang === "vi" ? uiStringsVi : uiStringsEn;
}

export function useUiStrings() {
  const { language } = useLanguage();
  return getUiStrings(language);
}
