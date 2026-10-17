import Num2persian from "num2persian";
import { persianNumber } from "./persianNumber.helper";

export function getElapsetTime(previousTimeStamp: number) {
  if (previousTimeStamp === 0) return "نامشخص";

  const secondsPerMinute = 60;
  const secondsPerHour = secondsPerMinute * 60;
  const secondsPerDay = secondsPerHour * 24;
  const secondsPerMonth = secondsPerDay * 30;
  const secondsPerYear = secondsPerDay * 365;

  const currentTimeStamp = Math.floor(new Date().getTime() / 1000);
  const elapsed = currentTimeStamp - previousTimeStamp;

  if (elapsed < secondsPerMinute) {
    return " لحظاتی پیش";
  } else if (elapsed < secondsPerHour) {
    return persianNumber(Math.round(elapsed / secondsPerMinute)) + " دقیقه پیش";
  } else if (elapsed < secondsPerDay) {
    return persianNumber(Math.round(elapsed / secondsPerHour)) + " ساعت پیش";
  } else if (elapsed < secondsPerMonth) {
    return persianNumber(Math.round(elapsed / secondsPerDay)) + " روز پیش";
  } else if (elapsed < secondsPerYear) {
    return persianNumber(Math.round(elapsed / secondsPerMonth)) + " ماه پیش";
  } else {
    return persianNumber(Math.round(elapsed / secondsPerYear)) + " سال پیش";
  }
}

export function getRemainingTime(targetTimeStamp: number) {
  const secondsPerMinute = 60;
  const secondsPerHour = secondsPerMinute * 60;
  const secondsPerDay = secondsPerHour * 24;
  const secondsPerMonth = secondsPerDay * 30;
  const secondsPerYear = secondsPerDay * 365;

  const currentTimeStamp = Math.floor(new Date().getTime() / 1000);
  const remaining = targetTimeStamp - currentTimeStamp;

  if (remaining < secondsPerMinute) {
    return Num2persian(Math.round(remaining / 1000)) + " ثانیه دیگر";
  } else if (remaining < secondsPerHour) {
    return persianNumber(
      `00:${Math.floor((remaining % secondsPerHour) / secondsPerMinute)} دیگر`,
    );
  } else if (remaining < secondsPerDay) {
    return persianNumber(
      `${Math.floor(remaining / secondsPerHour)}:${Math.floor((remaining % secondsPerHour) / secondsPerMinute)} دیگر`,
    );
  } else if (remaining < secondsPerMonth) {
    return Num2persian(Math.round(remaining / secondsPerDay)) + " روز دیگر";
  } else if (remaining < secondsPerYear) {
    return Num2persian(Math.round(remaining / secondsPerMonth)) + " ماه دیگر";
  } else {
    return Num2persian(Math.round(remaining / secondsPerYear)) + " سال دیگر";
  }
}

export function getRemainingTimeDHM(targetTimeStamp: number) {
  const secondsPerMinute = 60;
  const secondsPerHour = secondsPerMinute * 60;
  const secondsPerDay = secondsPerHour * 24;

  const currentTimeStamp = Math.floor(new Date().getTime() / 1000);
  const remaining = targetTimeStamp - currentTimeStamp;

  return {
    days: Math.round(remaining / secondsPerDay),
    hours: Math.floor((remaining % secondsPerDay) / secondsPerHour),
    minutes: Math.floor(
      ((remaining % secondsPerDay) % secondsPerHour) / secondsPerMinute,
    ),
  };
}
