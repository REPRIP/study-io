'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function RevealObserver() {
    const pathname = usePathname();

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            { threshold: 0.1 }
        );

        const observeElements = () => {
            const revealElements = document.querySelectorAll('.reveal-up:not(.visible)');
            revealElements.forEach((el) => observer.observe(el));
        };

        // Initial check
        observeElements();

        // Use MutationObserver to watch for newly added elements
        const mutationObserver = new MutationObserver(() => {
            observeElements();
        });

        mutationObserver.observe(document.body, {
            childList: true,
            subtree: true,
        });

        return () => {
            observer.disconnect();
            mutationObserver.disconnect();
        };
    }, [pathname]); // Re-run on route change

    return null;
}
