export function decodeRouteSegment(segment: string): string {
  const value = segment.trim();

  try {
    // Decode exactly once. This avoids double-encoding values such as %EB... when
    // the segment is later placed in URLSearchParams for the Nexon API request.
    return decodeURIComponent(value);
  } catch {
    // A literal or incomplete percent sequence should not crash the route.
    return value;
  }
}
