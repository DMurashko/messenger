export default function fromNow(dateObject) {

	const currentTime = new Date().getTime();
	const receivedTime = dateObject.getTime();
	const difference = currentTime - receivedTime;

	switch (true) {
		case difference <= 10*1000:
			return 'A few seconds ago';
		case difference > 10*1000 && difference < 60*1000:
			return `${Math.floor(difference/1000)} seconds ago`;
		case difference >= 60*1000 && difference < 10*60*1000:
			return 'A few minutes ago';
		case difference >= 10*60*1000 && difference < 60*60*1000:
			return `${Math.floor(difference/60*1000)} minutes ago`;
		case difference >= 60*60*1000 && difference < 2*60*60*1000:
			return `An hour ago`;
		case difference >= 2*60*60*1000 && difference < 24*60*60*1000:
			return `${Math.floor(difference/60*60*1000)} hours ago`;
		case difference >= 24*60*60*1000 && difference < 2*24*60*60*1000:
			return `A day ago`;
		case difference >= 2*24*60*60*1000 && difference < 31*24*60*60*1000:
			return `${Math.floor(difference/24*60*60*1000)} days ago`;
		case difference >= 31*24*60*60*1000 && difference < 62*24*60*60*1000:
			return `A month ago`;
		case difference >= 62*24*60*60*1000 && difference < 365*24*60*60*1000:
			return `${Math.floor(difference/31*24*60*60*1000)} months ago`;
		case difference >= 365*24*60*60*1000 && difference < 2*365*24*60*60*1000:
			return `A year ago`;
		case difference >= 2*365*24*60*60*1000:
			return `${Math.floor(difference/365*24*60*60*1000)} years ago`;
	}
}