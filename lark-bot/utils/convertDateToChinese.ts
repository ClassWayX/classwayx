const pad = (n: number) => String(n).padStart(2, '0');

export function convertDateToChinese(date: Date): string {
  const y  = date.getFullYear();
  const mo = date.getMonth() + 1; // 月份从 0 开始
  const d  = date.getDate();
  const h  = date.getHours();
  const mi = date.getMinutes();

  return `${y} 年 ${pad(mo)} 月 ${pad(d)} 日 ${pad(h)} 时 ${pad(mi)} 分`;
}