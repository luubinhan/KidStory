import React from "react";
import Lottie from "lottie-react";

import greyPulseAnimation from "../../assets/grey-pulse.json";
import { cn } from "../../lib/utils";

export type PulseProps = {
	className?: string;
	style?: React.CSSProperties;
	size?: number | string;
	ariaLabel?: string;
	loop?: boolean;
	autoplay?: boolean;
};

export function Pulse({
	className,
	style,
	size = 44,
	ariaLabel,
	loop = true,
	autoplay = true,
}: PulseProps) {
	return (
		<div
			className={cn(
				"inline-flex items-center justify-center bg-white/40 opacity-30 rounded-full cursor-pointer",
				className,
			)}
			style={{ width: size, height: size, ...style}}
			role={ariaLabel ? "img" : undefined}
			aria-label={ariaLabel}
			aria-hidden={ariaLabel ? undefined : true}
		>
			<Lottie animationData={greyPulseAnimation} loop={loop} autoplay={autoplay} className="h-full w-full" />
		</div>
	);
}
