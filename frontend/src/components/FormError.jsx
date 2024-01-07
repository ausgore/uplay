import { useState } from "react";
import Error from "../assets/images/error.png";
/**
 * @typedef FormErrorProps
 * @property {string} errorMessage
 */

/**
 * @param {FormErrorProps} props 
 */
const FormError = (props) => {
	const [isHovering, setIsHovering] = useState(false);

	return props.errorMessage && <div className="ml-1 relative items-center" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
		<img src={Error} className="w-5" />
		{isHovering && <div className="absolute right-0 bg-[rgba(0,0,0,0.85)] rounded-lg p-2 w-[200px] max-w-[200px] top-8 z-[1]">
			<p className="text-white text-sm">{props.errorMessage}</p>
		</div>}
	</div>
}

export default FormError;