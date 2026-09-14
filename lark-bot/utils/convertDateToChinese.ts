export function convertDateToChinese (date: Date): string {
  return `${date.getFullYear()} 年 ${date.getMonth() + 1} 月 ${date.getDate()} 日 \
${date.getHours()} 时 ${'0'.repeat(2 - date.getMinutes().toString().length)}${date.getMinutes()} 分`;
}