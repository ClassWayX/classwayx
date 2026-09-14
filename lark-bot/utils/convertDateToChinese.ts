export function convertDateToChinese(date: Date): string {
  return date.toLocaleString('zh-CN', { timeZone: '+08:00'})
}