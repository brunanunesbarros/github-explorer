export default function formatDate(data) {
  const newDate = new Date(data)
  return new Intl.DateTimeFormat('pt-BR').format(newDate);
}