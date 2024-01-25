import moment from 'moment';


// CURRENCY CONVERTER / HELPER FORMATTER
export function currencyConverter (amount) {
    return Number(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function numberFormatter (amount) {
    return Number(amount).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
 

// DATE CONVERTER HELPER FUNCTION
export function dateConverter(givenDate) {
    const currentDate = moment().startOf('day');
    const inputDate = moment(givenDate);

    const diffInSeconds = moment().diff(inputDate, 'seconds');
    if (diffInSeconds < 60) {
        // return `${diffInSeconds} seconds ago`;
        return 'Just now';
    }

    const diffInMins = moment().diff(inputDate, 'minutes');
    if (diffInMins < 60) {
        return `${diffInMins} minute ago`;
    }
  
    if (inputDate.isSame(currentDate, 'day')) {
      return `Today, ${inputDate.format('h:mm A')}`; 
    } else if (inputDate.isSame(currentDate.clone().subtract(1, 'day'), 'day')) {
        return `Yesterday, ${inputDate.format('h:mm A')}`;
    } else if (inputDate.isSame(currentDate.clone().subtract(2, 'day'), 'day')) {
        return `Two days ago`;
    } else {
      return inputDate.format('MMM Do YYYY');
    }
}


export function expectedDateFormatter(givenDate) {
	const currentDate = moment().startOf("day");
	const inputDate = moment(givenDate);

	if (inputDate.isSame(currentDate, "day")) {
		return "Today";
	} else if (inputDate.isBefore(currentDate)) {
		return "Date Passed";
	} else {
		const diffInDays = inputDate.diff(currentDate, "days", true);

		if (diffInDays >= 365) {
			const years = Math.floor(diffInDays / 365);
			return `In ${years} year${years > 1 ? "s" : ""}`;
		} else if (diffInDays >= 30) {
			const months = Math.floor(diffInDays / 30);
			return `In ${months} month${months > 1 ? "s" : ""}`;
		} else if (diffInDays >= 1) {
			return `In ${Math.floor(diffInDays)} day${diffInDays > 1 ? "s" : ""}`;
		} else {
			const diffInHours = inputDate.diff(currentDate, "hours", true);
			if (diffInHours >= 1) {
				return `In ${Math.floor(diffInHours)} hour${diffInHours > 1 ? "s" : ""}`;
			} else {
				const diffInMinutes = inputDate.diff(currentDate, "minutes", true);
				return `In ${Math.floor(diffInMinutes)} minute${diffInMinutes > 1 ? "s" : ""}`;
			}
		}
	}
}