"use client";
import {
	CircleStencil,
	Cropper,
	ImageRestriction,
} from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

interface ImageCropperProps {
	image: string;
	onCrop: (image: string) => void;
	cropperRef: React.RefObject<any>;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

// TODO: Make it good as https://advanced-cropper.github.io/react-advanced-cropper/#default-cropper
// Right now it is good enough but i think i should makeit look more good
export default function ImageCropper({
	image,
	onCrop,
	cropperRef,
	open,
	onOpenChange,
}: ImageCropperProps) {
	const onCropWrapper = () => {
		if (cropperRef.current) {
			const canvas = cropperRef.current.getCanvas();
			if (canvas) {
				onCrop(canvas.toDataURL());
			}
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="w-[90vw] h-[90vh] max-w-full max-h-full">
				<DialogHeader>
					<DialogTitle>Crop your avatar</DialogTitle>
				</DialogHeader>
				<div className="h-full w-full flex flex-col items-center justify-center">
					<div className="w-[75vw] h-[75vh]">
						<Cropper
							ref={cropperRef}
							src={image}
							boundaryClassName="border-2 border-gray-300"
							stencilComponent={CircleStencil}
							minWidth={500}
							imageRestriction={ImageRestriction.fitArea}
						/>
					</div>
					<DialogFooter className="mt-4">
						<Button onClick={onCropWrapper}>Crop</Button>
					</DialogFooter>
				</div>
			</DialogContent>
		</Dialog>
	);
}
