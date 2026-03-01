import React from "react";
import { ArrowRight, Wallet } from "lucide-react";
import { motion } from "motion/react";

export function StepWelcome({ onNext }: { onNext: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center text-center px-4 max-w-sm mx-auto h-full space-y-8">

            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 20, stiffness: 200 }}
                className="w-24 h-24 bg-primary text-primary-foreground rounded-[32px] flex items-center justify-center diffusion-shadow"
            >
                <Wallet className="w-12 h-12" strokeWidth={2} />
            </motion.div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, type: "spring", damping: 20 }}
            >
                <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">Split</h1>
                <p className="text-[17px] text-muted-foreground leading-relaxed">
                    Gérez vos dépenses communes simplement. Les bons comptes font les bons amis, avec une interface pensée pour vous.
                </p>
            </motion.div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring", damping: 20 }}
                className="w-full pt-8"
            >
                <button
                    onClick={onNext}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-primary-foreground font-semibold text-[17px] rounded-[16px] active-press diffusion-shadow"
                >
                    Commencer <ArrowRight className="w-5 h-5" />
                </button>
            </motion.div>
        </div>
    );
}
