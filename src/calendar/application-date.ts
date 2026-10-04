function getPreviewDate(): Date | null {
  if (import.meta.env.VITE_PREVIEW_MODE !== 'true') {
    return null;
  }

  const previewDate = import.meta.env.VITE_PREVIEW_DATE;
  if (!previewDate) {
    return null;
  }

  const parsedPreviewDate = new Date(`${previewDate}T12:00:00`);
  if (Number.isNaN(parsedPreviewDate.getTime())) {
    return null;
  }

  return parsedPreviewDate;
}

export function getApplicationDate(): Date {
  return getPreviewDate() ?? new Date();
}
