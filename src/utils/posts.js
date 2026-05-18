const KOREA_TIME_ZONE = 'Asia/Seoul';

const dayFormatter = new Intl.DateTimeFormat('ko-KR', {
  timeZone: KOREA_TIME_ZONE,
  weekday: 'short'
});

const dateTimeFormatter = new Intl.DateTimeFormat('ko-KR', {
  timeZone: KOREA_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false
});

export function getPostDateValue(date) {
  if (!date) return 0;
  return parsePostDate(date).valueOf();
}

export function formatKoreanDateTime(date) {
  if (!date) return '';

  const parsed = parsePostDate(date);
  if (Number.isNaN(parsed.valueOf())) return String(date);

  const parts = Object.fromEntries(
    dateTimeFormatter.formatToParts(parsed).map((part) => [part.type, part.value])
  );
  const weekday = dayFormatter.format(parsed);

  return `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute} (${weekday}) KST`;
}

export function getMachineDateTime(date) {
  if (!date) return undefined;

  const parsed = parsePostDate(date);
  if (Number.isNaN(parsed.valueOf())) return undefined;

  return parsed.toISOString();
}

export function getPostThumbnail(frontmatter = {}, rawContent = '') {
  if (frontmatter.cover) return frontmatter.cover;

  const markdownImage = rawContent.match(/!\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/);
  if (markdownImage?.[1]) return markdownImage[1];

  const htmlImage = rawContent.match(/<img\b[^>]*\bsrc=["']([^"']+)["']/i);
  if (htmlImage?.[1]) return htmlImage[1];

  return '';
}

function parsePostDate(date) {
  if (date instanceof Date) {
    if (
      date.getUTCHours() === 0 &&
      date.getUTCMinutes() === 0 &&
      date.getUTCSeconds() === 0 &&
      date.getUTCMilliseconds() === 0
    ) {
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const day = String(date.getUTCDate()).padStart(2, '0');
      return new Date(`${year}-${month}-${day}T00:00:00+09:00`);
    }

    return date;
  }

  const value = String(date);
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date(`${value}T00:00:00+09:00`);
  }

  const utcDateOnly = value.match(/^(\d{4}-\d{2}-\d{2})T00:00:00(?:\.000)?Z$/);
  if (utcDateOnly) {
    return new Date(`${utcDateOnly[1]}T00:00:00+09:00`);
  }

  return new Date(value);
}
