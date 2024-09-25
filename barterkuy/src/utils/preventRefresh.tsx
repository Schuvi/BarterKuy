import { useEffect } from "react";

function PreventPullRefresh({ children }: any) {
    useEffect(() => {
        let startY = 0;

        const handleTouchStart = (e: any) => {
            if (e.touches.length === 1) {
                startY = e.touches[0].clientY;
            }
        };

        const handleTouchMove = (e: any) => {
            const currentY = e.touches[0].clientY;
            if (window.scrollY === 0 && currentY > startY) {
                e.preventDefault(); 
            }
        };

        document.addEventListener("touchstart", handleTouchStart, { passive: true });
        document.addEventListener("touchmove", handleTouchMove, { passive: false });

        return () => {
            document.removeEventListener("touchstart", handleTouchStart);
            document.removeEventListener("touchmove", handleTouchMove);
        };
    }, []);

    return (
        <div>
            {children}
        </div>
    )
}

export default PreventPullRefresh