import { FaWhatsapp, FaInstagram, FaFacebook, FaEnvelope } from "react-icons/fa";

export default function ContactPage() {
  return (
    <section className="flex justify-center py-16 px-6">
      <div className="max-w-2xl w-full bg-white/5 backdrop-blur-md p-10 rounded-2xl shadow-xl border border-white/10">
        
        <h1 className="text-4xl font-bold mb-4 text-center">
          Contáctanos
        </h1>

        <p className="text-lg text-gray-300 text-center mb-10">
          Estamos disponibles en nuestras redes sociales y plataformas de contacto.
          Puedes escribirnos en cualquiera de las siguientes opciones:
        </p>

        <div className="flex flex-col gap-4">

          {/* WhatsApp */}
          <a
            href="https://wa.me/50760000000" 
            target="_blank"
            className="flex items-center gap-3 bg-green-600 text-white px-5 py-3 rounded-xl hover:bg-green-700 transition shadow-lg"
          >
            <FaWhatsapp size={24} />
            <span className="text-lg">WhatsApp</span>
          </a>

          {/* Instagram */}
          <a
            href="https://instagram.com/TU_INSTAGRAM"
            target="_blank"
            className="flex items-center gap-3 bg-pink-600 text-white px-5 py-3 rounded-xl hover:bg-pink-700 transition shadow-lg"
          >
            <FaInstagram size={24} />
            <span className="text-lg">Instagram</span>
          </a>

          {/* Facebook */}
          <a
            href="https://facebook.com/TU_FACEBOOK"
            target="_blank"
            className="flex items-center gap-3 bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 transition shadow-lg"
          >
            <FaFacebook size={24} />
            <span className="text-lg">Facebook</span>
          </a>

          {/* Email */}
          <a
            href="mailto:tu_correo@correo.com"
            className="flex items-center gap-3 bg-gray-700 text-white px-5 py-3 rounded-xl hover:bg-gray-800 transition shadow-lg"
          >
            <FaEnvelope size={24} />
            <span className="text-lg">Correo electrónico</span>
          </a>

        </div>
      </div>
    </section>
  );
}
