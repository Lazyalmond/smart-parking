export const PARKING_RATE_PER_HOUR = 30;

const HOUR_IN_MILLISECONDS = 60 * 60 * 1000;
const ROUND_UP_THRESHOLD_IN_MILLISECONDS = 15 * 60 * 1000;

export function calculateParkingCharge(entryTimestamp, exitTimestamp = Date.now()) {
  const entryTime = new Date(entryTimestamp).getTime();
  const exitTime = typeof exitTimestamp === 'number'
    ? exitTimestamp
    : new Date(exitTimestamp).getTime();

  if (!Number.isFinite(entryTime) || !Number.isFinite(exitTime) || exitTime <= entryTime) {
    return { durationMinutes: 0, billedHours: 0, amount: 0 };
  }

  const elapsedMilliseconds = exitTime - entryTime;
  const completeHours = Math.floor(elapsedMilliseconds / HOUR_IN_MILLISECONDS);
  const remainingMilliseconds = elapsedMilliseconds % HOUR_IN_MILLISECONDS;
  const billedHours = completeHours + (
    remainingMilliseconds >= ROUND_UP_THRESHOLD_IN_MILLISECONDS ? 1 : 0
  );

  return {
    durationMinutes: Math.floor(elapsedMilliseconds / (60 * 1000)),
    billedHours,
    amount: billedHours * PARKING_RATE_PER_HOUR,
  };
}
