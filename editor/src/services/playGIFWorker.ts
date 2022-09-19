let stopped = true;

export async function play(frames, selectFrame) {
	stopped = false;
	await loop(frames, selectFrame);
}

export async function stop() {
	stopped = true;
}

async function loop(frames, selectFrame) {
	if (!stopped) {
		for (const frame of frames) {
			if (!stopped) {
				selectFrame(frame);
				await new Promise(resolve => setTimeout(resolve, 1000));
			}
		}
		await loop(frames, selectFrame);
	}
}
