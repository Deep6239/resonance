"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { TextInputPanel } from "@/features/text-to-speech/components/text-input-panel";
import { VoicePrevirewPlaceholder } from "../components/voice-preview-placeholder";
import { SettingsPanel } from "../components/settings-panel";

import { 
    TextToSpeechForm,
    defaultTTSValues,
    type TTSFormValue
} from "../components/text-to-speech-form"; 
import { TTSVoiceProvider } from "../contexts/tts-voice-context";

export function TextToSpeechView({
    intialValues,
}:{
    intialValues?: Partial<TTSFormValue>;
}){
    const trpc = useTRPC();
    const {
        data: voices,
    } = useSuspenseQuery(trpc.voices.getAll.queryOptions())

    const { custom: customVoices, system: systemVoices } = voices;

    const allVoices = [...customVoices, ...systemVoices];
    const fallbackVoiceId = allVoices[0]?.id ?? "";

    //Requested voice may no longer exist {deleted}: fall back to first available
    const resolvedVoiceId = intialValues?.voiceId &&
        allVoices.some((v) => v.id === intialValues.voiceId)
            ? intialValues.voiceId : fallbackVoiceId;

    const defaultValues: TTSFormValue = {
        ...defaultTTSValues,
        ...intialValues,
        voiceId: resolvedVoiceId,
    };

    return(
        <TTSVoiceProvider value={{ customVoices, systemVoices, allVoices }}>
            <TextToSpeechForm defaultValues={defaultValues}>
                <div className="flex min-h-0 flex-1 overflow-hidden">
                    <div className="flex min-h-0 flex-1 flex-col">
                        <TextInputPanel />
                        <VoicePrevirewPlaceholder />
                    </div>
                    <SettingsPanel />
                </div>
            </TextToSpeechForm>
        </TTSVoiceProvider>
    )
}