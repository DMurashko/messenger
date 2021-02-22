export const tempStorage = new Map();

export function findUserIdBySocketId(socketId) {
	for (let elem of tempStorage.entries()) {
		if (elem[1] === socketId) {
			return elem[0];
		}
	}
}