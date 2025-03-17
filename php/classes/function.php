<?php
function getWorkingDaysInMonth(int $year, int $month) {
    $result = [];
    $startDate = new DateTime("$year-$month-01"); // Первый день месяца

    // Следующий месяц 1 день
    $endDate = new DateTime("$year-$month-01");   // Берем текущий
    $endDate = $endDate->modify('+1 month');      // Меняем на следующий

    $interval = new DateInterval('P1D');

    $period = new DatePeriod($startDate, $interval, $endDate);

    $workingDays = 0;
    $res = [];

    // Определяем количество рабочих дней в месяце
    foreach ($period as $date) {
        if ($date->format('N') < 6) { // Если день недели не равен 6 (суббота) или 7 (воскресенье)
            $workingDays++;
            $res[] = $date->format('d.m.Y');
        }
    }

    $result['workingDays']  = $workingDays;

    // Определяем первый рабочий день
    while ($startDate->format('N') >= 6) { // Пока это суббота (6) или воскресенье (7)
        $startDate->modify('+1 day'); // Переход к следующему дню
    }

    $result['startDate'] = (int) $startDate->format('d');

    // Определяем последний рабочий день
    $lastDayOfMonth = date('t', strtotime("$year-$month-01")); // Последнее число месяца
    $date = new DateTime("$year-$month-$lastDayOfMonth"); // Последняя дата месяца
    while ($date->format('N') > 5) { // Пока это суббота (6) или воскресенье (7)
        $date->modify('-1 day'); // Переход к предыдущему дню
    }
    $result['endDate'] = (int) $date->format('d');


    return $result;
}