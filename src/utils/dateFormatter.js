import { format } from 'date-fns';
import { bs } from 'date-fns/locale';

export default function formater(date) {
  return format(date, 'dd.MM.yyyy, HH:mm', { locale: bs });
}
