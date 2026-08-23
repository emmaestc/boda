import { Invitation } from "@/components/invitation/Invitation";

/**
 * Invitación pública, sin código personal.
 *
 * Se ve la experiencia completa —es la que se comparte y la que sirve de vista
 * previa— pero la confirmación de asistencia queda cerrada: para responder hay
 * que entrar por el enlace personal, que es lo único que sabe cuántos lugares
 * hay reservados y a nombre de quién.
 */
export default function Home() {
  return <Invitation guest={null} />;
}
