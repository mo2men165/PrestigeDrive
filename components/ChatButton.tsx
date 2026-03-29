import { FaWhatsapp } from 'react-icons/fa';

const WHATSAPP_NUMBER = '447511053460';
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi EliteDrive4U, I would like to enquire about your services.')}`;

const ChatButton = () => {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-[#25D366] text-white pl-4 pr-5 py-3 rounded-full shadow-lg hover:bg-[#1ebe57] hover:shadow-xl hover:scale-105 transition-all duration-200"
    >
      <FaWhatsapp className="text-2xl" />
      <span className="text-sm font-semibold">WhatsApp</span>
    </a>
  );
};

export default ChatButton;
