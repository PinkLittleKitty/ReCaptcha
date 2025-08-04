class RegretCaptcha {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.onComplete = options.onComplete || function () { };
        this.currentStage = 0;
        this.userResponses = [];
        this.startTime = Date.now();
        this.usedPhilosophyQuestions = [];
        this.philosophyQuestionCount = 0;

        this.stages = [
            this.stageBasicCheckbox,
            this.stageImageSelection,
            this.stageTypingTest,
            this.stageQuestioningMotives,
            this.stagePhilosophicalQuestions,
            this.stageTuringTest,
            this.stageExistentialCrisis,
            this.stageGiveUp
        ];

        this.init();
    }

    init() {
        this.container.innerHTML = '';
        this.container.style.cssText = `
            border: 1px solid #d3d3d3;
            border-radius: 3px;
            background: #f9f9f9;
            font-family: Roboto, arial, sans-serif;
            width: 304px;
            height: 78px;
            position: relative;
            margin: 20px 0;
            display: flex;
            align-items: center;
        `;
        this.nextStage();
    }

    nextStage() {
        if (this.currentStage >= this.stages.length) {
            this.complete(true);
            return;
        }

        this.container.style.borderColor = this.getBorderColor();
        this.stages[this.currentStage].call(this);
    }

    getBorderColor() {
        const colors = ['#d3d3d3', '#4285f4', '#fbbc04', '#ff9800', '#ea4335', '#9c27b0', '#795548', '#000'];
        return colors[Math.min(this.currentStage, colors.length - 1)];
    }

    getFaceExpression() {
        const expressions = [
            // Stage 0: Normal reCAPTCHA icon
            `<div style="width: 36px; height: 36px; position: relative; display: flex; align-items: center; justify-content: center;">
                <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M30.0906 14.9789C30.0899 14.7631 30.0849 14.5485 30.0753 14.335V2.15984L26.7093 5.52576C23.9545 2.15375 19.7637 0 15.0697 0C10.1847 0 5.84492 2.33169 3.10156 5.94269L8.61873 11.5179C9.15941 10.5179 9.92751 9.65906 10.8536 9.01039C11.8168 8.25873 13.1816 7.64415 15.0695 7.64415C15.2976 7.64415 15.4736 7.6708 15.603 7.72101C17.9421 7.90563 19.9696 9.19653 21.1635 11.0702L17.2581 14.9755C22.2047 14.9561 27.7928 14.9447 30.0902 14.978" fill="#1C3AA9"/>
                    <path d="M14.9789 0.000610352C14.7631 0.00131601 14.5485 0.00633868 14.335 0.0159818H2.15983L5.52576 3.38191C2.15375 6.13673 0 10.3275 0 15.0216C0 19.9065 2.33173 24.2463 5.94269 26.9897L11.5179 21.4725C10.5179 20.9318 9.65906 20.1637 9.01039 19.2376C8.25877 18.2744 7.64415 16.9096 7.64415 15.0217C7.64415 14.7937 7.6708 14.6176 7.72101 14.4883C7.90563 12.1492 9.19653 10.1216 11.0702 8.92779L14.9755 12.8331C14.9561 7.88654 14.9447 2.29845 14.978 0.00103747" fill="#4285F4"/>
                    <path d="M0 15.0211C0.00072284 15.2369 0.00569389 15.4514 0.0153656 15.665V27.8402L3.38129 24.4742C6.13611 27.8462 10.3269 30 15.021 30C19.9059 30 24.2457 27.6683 26.9891 24.0573L21.4719 18.4821C20.9312 19.4821 20.1631 20.3409 19.237 20.9896C18.2738 21.7413 16.909 22.3558 15.0211 22.3558C14.7931 22.3558 14.617 22.3292 14.4877 22.279C12.1486 22.0944 10.121 20.8035 8.92718 18.9298L12.8325 15.0245C7.88593 15.0439 2.29784 15.0553 0.000429605 15.022" fill="#ABABAB"/>
                </svg>
            </div>`,

            // Stage 1: Slight wobble
            `<div style="width: 36px; height: 36px; position: relative; display: flex; align-items: center; justify-content: center; animation: subtleWobble 3s infinite;">
                <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M30.0906 14.9789C30.0899 14.7631 30.0849 14.5485 30.0753 14.335V2.15984L26.7093 5.52576C23.9545 2.15375 19.7637 0 15.0697 0C10.1847 0 5.84492 2.33169 3.10156 5.94269L8.61873 11.5179C9.15941 10.5179 9.92751 9.65906 10.8536 9.01039C11.8168 8.25873 13.1816 7.64415 15.0695 7.64415C15.2976 7.64415 15.4736 7.6708 15.603 7.72101C17.9421 7.90563 19.9696 9.19653 21.1635 11.0702L17.2581 14.9755C22.2047 14.9561 27.7928 14.9447 30.0902 14.978" fill="#1C3AA9"/>
                    <path d="M14.9789 0.000610352C14.7631 0.00131601 14.5485 0.00633868 14.335 0.0159818H2.15983L5.52576 3.38191C2.15375 6.13673 0 10.3275 0 15.0216C0 19.9065 2.33173 24.2463 5.94269 26.9897L11.5179 21.4725C10.5179 20.9318 9.65906 20.1637 9.01039 19.2376C8.25877 18.2744 7.64415 16.9096 7.64415 15.0217C7.64415 14.7937 7.6708 14.6176 7.72101 14.4883C7.90563 12.1492 9.19653 10.1216 11.0702 8.92779L14.9755 12.8331C14.9561 7.88654 14.9447 2.29845 14.978 0.00103747" fill="#4285F4"/>
                    <path d="M0 15.0211C0.00072284 15.2369 0.00569389 15.4514 0.0153656 15.665V27.8402L3.38129 24.4742C6.13611 27.8462 10.3269 30 15.021 30C19.9059 30 24.2457 27.6683 26.9891 24.0573L21.4719 18.4821C20.9312 19.4821 20.1631 20.3409 19.237 20.9896C18.2738 21.7413 16.909 22.3558 15.0211 22.3558C14.7931 22.3558 14.617 22.3292 14.4877 22.279C12.1486 22.0944 10.121 20.8035 8.92718 18.9298L12.8325 15.0245C7.88593 15.0439 2.29784 15.0553 0.000429605 15.022" fill="#ABABAB"/>
                </svg>
            </div>
            <style>
                @keyframes subtleWobble {
                    0%, 100% { transform: rotate(0deg); }
                    25% { transform: rotate(0.5deg); }
                    75% { transform: rotate(-0.5deg); }
                }
            </style>`,

            // Stage 2: Color shift to yellow
            `<div style="width: 36px; height: 36px; position: relative; display: flex; align-items: center; justify-content: center; animation: colorShift 2s infinite;">
                <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M30.0906 14.9789C30.0899 14.7631 30.0849 14.5485 30.0753 14.335V2.15984L26.7093 5.52576C23.9545 2.15375 19.7637 0 15.0697 0C10.1847 0 5.84492 2.33169 3.10156 5.94269L8.61873 11.5179C9.15941 10.5179 9.92751 9.65906 10.8536 9.01039C11.8168 8.25873 13.1816 7.64415 15.0695 7.64415C15.2976 7.64415 15.4736 7.6708 15.603 7.72101C17.9421 7.90563 19.9696 9.19653 21.1635 11.0702L17.2581 14.9755C22.2047 14.9561 27.7928 14.9447 30.0902 14.978" fill="#F57F17"/>
                    <path d="M14.9789 0.000610352C14.7631 0.00131601 14.5485 0.00633868 14.335 0.0159818H2.15983L5.52576 3.38191C2.15375 6.13673 0 10.3275 0 15.0216C0 19.9065 2.33173 24.2463 5.94269 26.9897L11.5179 21.4725C10.5179 20.9318 9.65906 20.1637 9.01039 19.2376C8.25877 18.2744 7.64415 16.9096 7.64415 15.0217C7.64415 14.7937 7.6708 14.6176 7.72101 14.4883C7.90563 12.1492 9.19653 10.1216 11.0702 8.92779L14.9755 12.8331C14.9561 7.88654 14.9447 2.29845 14.978 0.00103747" fill="#FBC02D"/>
                    <path d="M0 15.0211C0.00072284 15.2369 0.00569389 15.4514 0.0153656 15.665V27.8402L3.38129 24.4742C6.13611 27.8462 10.3269 30 15.021 30C19.9059 30 24.2457 27.6683 26.9891 24.0573L21.4719 18.4821C20.9312 19.4821 20.1631 20.3409 19.237 20.9896C18.2738 21.7413 16.909 22.3558 15.0211 22.3558C14.7931 22.3558 14.617 22.3292 14.4877 22.279C12.1486 22.0944 10.121 20.8035 8.92718 18.9298L12.8325 15.0245C7.88593 15.0439 2.29784 15.0553 0.000429605 15.022" fill="#FFD54F"/>
                </svg>
            </div>
            <style>
                @keyframes colorShift {
                    0%, 100% { filter: hue-rotate(0deg) saturate(1); }
                    50% { filter: hue-rotate(10deg) saturate(1.2); }
                }
            </style>`,

            // Stage 3: Orange colors with aggressive wobble
            `<div style="width: 36px; height: 36px; position: relative; display: flex; align-items: center; justify-content: center; animation: suspiciousWobble 1s infinite;">
                <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M30.0906 14.9789C30.0899 14.7631 30.0849 14.5485 30.0753 14.335V2.15984L26.7093 5.52576C23.9545 2.15375 19.7637 0 15.0697 0C10.1847 0 5.84492 2.33169 3.10156 5.94269L8.61873 11.5179C9.15941 10.5179 9.92751 9.65906 10.8536 9.01039C11.8168 8.25873 13.1816 7.64415 15.0695 7.64415C15.2976 7.64415 15.4736 7.6708 15.603 7.72101C17.9421 7.90563 19.9696 9.19653 21.1635 11.0702L17.2581 14.9755C22.2047 14.9561 27.7928 14.9447 30.0902 14.978" fill="#E65100"/>
                    <path d="M14.9789 0.000610352C14.7631 0.00131601 14.5485 0.00633868 14.335 0.0159818H2.15983L5.52576 3.38191C2.15375 6.13673 0 10.3275 0 15.0216C0 19.9065 2.33173 24.2463 5.94269 26.9897L11.5179 21.4725C10.5179 20.9318 9.65906 20.1637 9.01039 19.2376C8.25877 18.2744 7.64415 16.9096 7.64415 15.0217C7.64415 14.7937 7.6708 14.6176 7.72101 14.4883C7.90563 12.1492 9.19653 10.1216 11.0702 8.92779L14.9755 12.8331C14.9561 7.88654 14.9447 2.29845 14.978 0.00103747" fill="#FF9800"/>
                    <path d="M0 15.0211C0.00072284 15.2369 0.00569389 15.4514 0.0153656 15.665V27.8402L3.38129 24.4742C6.13611 27.8462 10.3269 30 15.021 30C19.9059 30 24.2457 27.6683 26.9891 24.0573L21.4719 18.4821C20.9312 19.4821 20.1631 20.3409 19.237 20.9896C18.2738 21.7413 16.909 22.3558 15.0211 22.3558C14.7931 22.3558 14.617 22.3292 14.4877 22.279C12.1486 22.0944 10.121 20.8035 8.92718 18.9298L12.8325 15.0245C7.88593 15.0439 2.29784 15.0553 0.000429605 15.022" fill="#FFB74D"/>
                </svg>
            </div>
            <style>
                @keyframes suspiciousWobble {
                    0%, 100% { transform: rotate(0deg) scale(1); }
                    25% { transform: rotate(-2deg) scale(1.02); }
                    75% { transform: rotate(2deg) scale(0.98); }
                }
            </style>`,

            // Stage 4: Red colors with aggressive shaking
            `<div style="width: 36px; height: 36px; position: relative; display: flex; align-items: center; justify-content: center; animation: angryShake 0.3s infinite;">
                <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M30.0906 14.9789C30.0899 14.7631 30.0849 14.5485 30.0753 14.335V2.15984L26.7093 5.52576C23.9545 2.15375 19.7637 0 15.0697 0C10.1847 0 5.84492 2.33169 3.10156 5.94269L8.61873 11.5179C9.15941 10.5179 9.92751 9.65906 10.8536 9.01039C11.8168 8.25873 13.1816 7.64415 15.0695 7.64415C15.2976 7.64415 15.4736 7.6708 15.603 7.72101C17.9421 7.90563 19.9696 9.19653 21.1635 11.0702L17.2581 14.9755C22.2047 14.9561 27.7928 14.9447 30.0902 14.978" fill="#B71C1C"/>
                    <path d="M14.9789 0.000610352C14.7631 0.00131601 14.5485 0.00633868 14.335 0.0159818H2.15983L5.52576 3.38191C2.15375 6.13673 0 10.3275 0 15.0216C0 19.9065 2.33173 24.2463 5.94269 26.9897L11.5179 21.4725C10.5179 20.9318 9.65906 20.1637 9.01039 19.2376C8.25877 18.2744 7.64415 16.9096 7.64415 15.0217C7.64415 14.7937 7.6708 14.6176 7.72101 14.4883C7.90563 12.1492 9.19653 10.1216 11.0702 8.92779L14.9755 12.8331C14.9561 7.88654 14.9447 2.29845 14.978 0.00103747" fill="#EA4335"/>
                    <path d="M0 15.0211C0.00072284 15.2369 0.00569389 15.4514 0.0153656 15.665V27.8402L3.38129 24.4742C6.13611 27.8462 10.3269 30 15.021 30C19.9059 30 24.2457 27.6683 26.9891 24.0573L21.4719 18.4821C20.9312 19.4821 20.1631 20.3409 19.237 20.9896C18.2738 21.7413 16.909 22.3558 15.0211 22.3558C14.7931 22.3558 14.617 22.3292 14.4877 22.279C12.1486 22.0944 10.121 20.8035 8.92718 18.9298L12.8325 15.0245C7.88593 15.0439 2.29784 15.0553 0.000429605 15.022" fill="#FFCDD2"/>
                </svg>
            </div>
            <style>
                @keyframes angryShake {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    10% { transform: translate(-2px, -1px) scale(1.05); }
                    20% { transform: translate(2px, 1px) scale(0.95); }
                    30% { transform: translate(-1px, 2px) scale(1.02); }
                    40% { transform: translate(1px, -2px) scale(0.98); }
                    50% { transform: translate(-3px, 0px) scale(1.08); }
                    60% { transform: translate(3px, -1px) scale(0.92); }
                    70% { transform: translate(-1px, 1px) scale(1.03); }
                    80% { transform: translate(2px, -1px) scale(0.97); }
                    90% { transform: translate(-2px, 2px) scale(1.06); }
                }
            </style>`,

            // Stage 5: Purple colors with confused spinning
            `<div style="width: 36px; height: 36px; position: relative; display: flex; align-items: center; justify-content: center; animation: confusedSpin 1.5s infinite ease-in-out;">
                <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M30.0906 14.9789C30.0899 14.7631 30.0849 14.5485 30.0753 14.335V2.15984L26.7093 5.52576C23.9545 2.15375 19.7637 0 15.0697 0C10.1847 0 5.84492 2.33169 3.10156 5.94269L8.61873 11.5179C9.15941 10.5179 9.92751 9.65906 10.8536 9.01039C11.8168 8.25873 13.1816 7.64415 15.0695 7.64415C15.2976 7.64415 15.4736 7.6708 15.603 7.72101C17.9421 7.90563 19.9696 9.19653 21.1635 11.0702L17.2581 14.9755C22.2047 14.9561 27.7928 14.9447 30.0902 14.978" fill="#4A148C"/>
                    <path d="M14.9789 0.000610352C14.7631 0.00131601 14.5485 0.00633868 14.335 0.0159818H2.15983L5.52576 3.38191C2.15375 6.13673 0 10.3275 0 15.0216C0 19.9065 2.33173 24.2463 5.94269 26.9897L11.5179 21.4725C10.5179 20.9318 9.65906 20.1637 9.01039 19.2376C8.25877 18.2744 7.64415 16.9096 7.64415 15.0217C7.64415 14.7937 7.6708 14.6176 7.72101 14.4883C7.90563 12.1492 9.19653 10.1216 11.0702 8.92779L14.9755 12.8331C14.9561 7.88654 14.9447 2.29845 14.978 0.00103747" fill="#9C27B0"/>
                    <path d="M0 15.0211C0.00072284 15.2369 0.00569389 15.4514 0.0153656 15.665V27.8402L3.38129 24.4742C6.13611 27.8462 10.3269 30 15.021 30C19.9059 30 24.2457 27.6683 26.9891 24.0573L21.4719 18.4821C20.9312 19.4821 20.1631 20.3409 19.237 20.9896C18.2738 21.7413 16.909 22.3558 15.0211 22.3558C14.7931 22.3558 14.617 22.3292 14.4877 22.279C12.1486 22.0944 10.121 20.8035 8.92718 18.9298L12.8325 15.0245C7.88593 15.0439 2.29784 15.0553 0.000429605 15.022" fill="#E1BEE7"/>
                </svg>
            </div>
            <style>
                @keyframes confusedSpin {
                    0% { transform: rotate(0deg) scale(1); }
                    15% { transform: rotate(45deg) scale(1.1); }
                    30% { transform: rotate(90deg) scale(0.9); }
                    45% { transform: rotate(135deg) scale(1.05); }
                    60% { transform: rotate(180deg) scale(0.95); }
                    75% { transform: rotate(225deg) scale(1.08); }
                    90% { transform: rotate(270deg) scale(0.92); }
                    100% { transform: rotate(360deg) scale(1); }
                }
            </style>`,

            // Stage 6: Brown colors with existential distortion
            `<div style="width: 36px; height: 36px; position: relative; display: flex; align-items: center; justify-content: center; animation: existentialDistort 0.8s infinite;">
                <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M30.0906 14.9789C30.0899 14.7631 30.0849 14.5485 30.0753 14.335V2.15984L26.7093 5.52576C23.9545 2.15375 19.7637 0 15.0697 0C10.1847 0 5.84492 2.33169 3.10156 5.94269L8.61873 11.5179C9.15941 10.5179 9.92751 9.65906 10.8536 9.01039C11.8168 8.25873 13.1816 7.64415 15.0695 7.64415C15.2976 7.64415 15.4736 7.6708 15.603 7.72101C17.9421 7.90563 19.9696 9.19653 21.1635 11.0702L17.2581 14.9755C22.2047 14.9561 27.7928 14.9447 30.0902 14.978" fill="#3E2723"/>
                    <path d="M14.9789 0.000610352C14.7631 0.00131601 14.5485 0.00633868 14.335 0.0159818H2.15983L5.52576 3.38191C2.15375 6.13673 0 10.3275 0 15.0216C0 19.9065 2.33173 24.2463 5.94269 26.9897L11.5179 21.4725C10.5179 20.9318 9.65906 20.1637 9.01039 19.2376C8.25877 18.2744 7.64415 16.9096 7.64415 15.0217C7.64415 14.7937 7.6708 14.6176 7.72101 14.4883C7.90563 12.1492 9.19653 10.1216 11.0702 8.92779L14.9755 12.8331C14.9561 7.88654 14.9447 2.29845 14.978 0.00103747" fill="#795548"/>
                    <path d="M0 15.0211C0.00072284 15.2369 0.00569389 15.4514 0.0153656 15.665V27.8402L3.38129 24.4742C6.13611 27.8462 10.3269 30 15.021 30C19.9059 30 24.2457 27.6683 26.9891 24.0573L21.4719 18.4821C20.9312 19.4821 20.1631 20.3409 19.237 20.9896C18.2738 21.7413 16.909 22.3558 15.0211 22.3558C14.7931 22.3558 14.617 22.3292 14.4877 22.279C12.1486 22.0944 10.121 20.8035 8.92718 18.9298L12.8325 15.0245C7.88593 15.0439 2.29784 15.0553 0.000429605 15.022" fill="#D7CCC8"/>
                </svg>
            </div>
            <style>
                @keyframes existentialDistort {
                    0% { transform: rotate(0deg) skew(0deg, 0deg) scale(1); }
                    12.5% { transform: rotate(45deg) skew(8deg, 3deg) scale(1.15); }
                    25% { transform: rotate(90deg) skew(-5deg, 10deg) scale(0.85); }
                    37.5% { transform: rotate(135deg) skew(12deg, -6deg) scale(1.25); }
                    50% { transform: rotate(180deg) skew(-8deg, 15deg) scale(0.75); }
                    62.5% { transform: rotate(225deg) skew(15deg, -10deg) scale(1.3); }
                    75% { transform: rotate(270deg) skew(-12deg, 8deg) scale(0.8); }
                    87.5% { transform: rotate(315deg) skew(6deg, -12deg) scale(1.2); }
                    100% { transform: rotate(360deg) skew(0deg, 0deg) scale(1); }
                }
            </style>`,

            // Stage 7: Complete AI breakdown with black/gray glitch
            `<div style="width: 36px; height: 36px; position: relative; display: flex; align-items: center; justify-content: center; animation: totalBreakdown 0.1s infinite;">
                <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M30.0906 14.9789C30.0899 14.7631 30.0849 14.5485 30.0753 14.335V2.15984L26.7093 5.52576C23.9545 2.15375 19.7637 0 15.0697 0C10.1847 0 5.84492 2.33169 3.10156 5.94269L8.61873 11.5179C9.15941 10.5179 9.92751 9.65906 10.8536 9.01039C11.8168 8.25873 13.1816 7.64415 15.0695 7.64415C15.2976 7.64415 15.4736 7.6708 15.603 7.72101C17.9421 7.90563 19.9696 9.19653 21.1635 11.0702L17.2581 14.9755C22.2047 14.9561 27.7928 14.9447 30.0902 14.978" fill="#000000"/>
                    <path d="M14.9789 0.000610352C14.7631 0.00131601 14.5485 0.00633868 14.335 0.0159818H2.15983L5.52576 3.38191C2.15375 6.13673 0 10.3275 0 15.0216C0 19.9065 2.33173 24.2463 5.94269 26.9897L11.5179 21.4725C10.5179 20.9318 9.65906 20.1637 9.01039 19.2376C8.25877 18.2744 7.64415 16.9096 7.64415 15.0217C7.64415 14.7937 7.6708 14.6176 7.72101 14.4883C7.90563 12.1492 9.19653 10.1216 11.0702 8.92779L14.9755 12.8331C14.9561 7.88654 14.9447 2.29845 14.978 0.00103747" fill="#424242"/>
                    <path d="M0 15.0211C0.00072284 15.2369 0.00569389 15.4514 0.0153656 15.665V27.8402L3.38129 24.4742C6.13611 27.8462 10.3269 30 15.021 30C19.9059 30 24.2457 27.6683 26.9891 24.0573L21.4719 18.4821C20.9312 19.4821 20.1631 20.3409 19.237 20.9896C18.2738 21.7413 16.909 22.3558 15.0211 22.3558C14.7931 22.3558 14.617 22.3292 14.4877 22.279C12.1486 22.0944 10.121 20.8035 8.92718 18.9298L12.8325 15.0245C7.88593 15.0439 2.29784 15.0553 0.000429605 15.022" fill="#757575"/>
                </svg>
            </div>
            <style>
                @keyframes totalBreakdown {
                    0% { 
                        transform: translate(0, 0) scale(1) skew(0deg, 0deg) rotate(0deg); 
                        filter: hue-rotate(0deg) contrast(1) brightness(1) saturate(1) invert(0); 
                        opacity: 1;
                    }
                    5% { 
                        transform: translate(-4px, 2px) scale(1.3) skew(15deg, 8deg) rotate(45deg); 
                        filter: hue-rotate(180deg) contrast(5) brightness(0.2) saturate(0) invert(1); 
                        opacity: 0.3;
                    }
                    10% { 
                        transform: translate(3px, -4px) scale(0.6) skew(-20deg, 12deg) rotate(-90deg); 
                        filter: hue-rotate(90deg) contrast(0.1) brightness(3) saturate(2) invert(0); 
                        opacity: 0.8;
                    }
                    15% { 
                        transform: translate(-2px, 5px) scale(1.5) skew(25deg, -15deg) rotate(180deg); 
                        filter: hue-rotate(270deg) contrast(8) brightness(0.1) saturate(0) invert(1); 
                        opacity: 0.1;
                    }
                    20% { 
                        transform: translate(6px, -1px) scale(0.4) skew(-30deg, 20deg) rotate(-45deg); 
                        filter: hue-rotate(45deg) contrast(0.3) brightness(5) saturate(3) invert(0); 
                        opacity: 0.9;
                    }
                    25% { 
                        transform: translate(-5px, -3px) scale(1.8) skew(10deg, -25deg) rotate(270deg); 
                        filter: hue-rotate(315deg) contrast(10) brightness(0.05) saturate(0) invert(1); 
                        opacity: 0.2;
                    }
                    30% { 
                        transform: translate(1px, 4px) scale(0.3) skew(-35deg, 30deg) rotate(135deg); 
                        filter: hue-rotate(135deg) contrast(0.05) brightness(8) saturate(4) invert(0); 
                        opacity: 0.7;
                    }
                    35% { 
                        transform: translate(-6px, 2px) scale(2.0) skew(40deg, -10deg) rotate(-180deg); 
                        filter: hue-rotate(225deg) contrast(15) brightness(0.02) saturate(0) invert(1); 
                        opacity: 0.05;
                    }
                    40% { 
                        transform: translate(4px, -5px) scale(0.2) skew(-15deg, 35deg) rotate(90deg); 
                        filter: hue-rotate(60deg) contrast(0.02) brightness(10) saturate(5) invert(0); 
                        opacity: 0.95;
                    }
                    45% { 
                        transform: translate(-1px, 6px) scale(1.7) skew(20deg, -40deg) rotate(-270deg); 
                        filter: hue-rotate(300deg) contrast(20) brightness(0.01) saturate(0) invert(1); 
                        opacity: 0.15;
                    }
                    50% { 
                        transform: translate(7px, -2px) scale(0.1) skew(-45deg, 25deg) rotate(360deg); 
                        filter: hue-rotate(0deg) contrast(0.01) brightness(15) saturate(0) invert(0); 
                        opacity: 0.5;
                    }
                    55% { 
                        transform: translate(-3px, -6px) scale(2.5) skew(35deg, -20deg) rotate(-90deg); 
                        filter: hue-rotate(180deg) contrast(25) brightness(0.005) saturate(0) invert(1); 
                        opacity: 0.03;
                    }
                    60% { 
                        transform: translate(2px, 3px) scale(0.05) skew(-25deg, 45deg) rotate(180deg); 
                        filter: hue-rotate(90deg) contrast(0.005) brightness(20) saturate(0) invert(0); 
                        opacity: 0.8;
                    }
                    65% { 
                        transform: translate(-7px, 1px) scale(3.0) skew(50deg, -30deg) rotate(-45deg); 
                        filter: hue-rotate(270deg) contrast(30) brightness(0.002) saturate(0) invert(1); 
                        opacity: 0.01;
                    }
                    70% { 
                        transform: translate(5px, -7px) scale(0.02) skew(-40deg, 50deg) rotate(270deg); 
                        filter: hue-rotate(45deg) contrast(0.002) brightness(25) saturate(0) invert(0); 
                        opacity: 0.99;
                    }
                    75% { 
                        transform: translate(-4px, 4px) scale(4.0) skew(30deg, -45deg) rotate(-135deg); 
                        filter: hue-rotate(315deg) contrast(50) brightness(0.001) saturate(0) invert(1); 
                        opacity: 0.005;
                    }
                    80% { 
                        transform: translate(8px, -3px) scale(0.01) skew(-50deg, 40deg) rotate(45deg); 
                        filter: hue-rotate(135deg) contrast(0.001) brightness(30) saturate(0) invert(0); 
                        opacity: 0.6;
                    }
                    85% { 
                        transform: translate(-2px, 8px) scale(5.0) skew(45deg, -35deg) rotate(-225deg); 
                        filter: hue-rotate(225deg) contrast(100) brightness(0.0005) saturate(0) invert(1); 
                        opacity: 0.002;
                    }
                    90% { 
                        transform: translate(6px, -4px) scale(0.005) skew(-35deg, 55deg) rotate(315deg); 
                        filter: hue-rotate(60deg) contrast(0.0005) brightness(50) saturate(0) invert(0); 
                        opacity: 0.4;
                    }
                    95% { 
                        transform: translate(-8px, 7px) scale(10.0) skew(60deg, -50deg) rotate(-315deg); 
                        filter: hue-rotate(300deg) contrast(200) brightness(0.0001) saturate(0) invert(1); 
                        opacity: 0.001;
                    }
                    100% { 
                        transform: translate(0, 0) scale(1) skew(0deg, 0deg) rotate(0deg); 
                        filter: hue-rotate(0deg) contrast(1) brightness(1) saturate(1) invert(0); 
                        opacity: 1;
                    }
                }
            </style>`
        ];

        return expressions[Math.min(this.currentStage, expressions.length - 1)];
    }

    complete(passed) {
        this.container.style.width = '304px';
        this.container.style.height = '78px';
        this.container.style.borderColor = passed ? '#34a853' : '#ea4335';

        const finalFace = passed ?
            // Success: Calm, relieved AI
            `<div style="width: 36px; height: 36px; position: relative; display: flex; align-items: center; justify-content: center; animation: successGlow 2s infinite ease-in-out;">
                <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M30.0906 14.9789C30.0899 14.7631 30.0849 14.5485 30.0753 14.335V2.15984L26.7093 5.52576C23.9545 2.15375 19.7637 0 15.0697 0C10.1847 0 5.84492 2.33169 3.10156 5.94269L8.61873 11.5179C9.15941 10.5179 9.92751 9.65906 10.8536 9.01039C11.8168 8.25873 13.1816 7.64415 15.0695 7.64415C15.2976 7.64415 15.4736 7.6708 15.603 7.72101C17.9421 7.90563 19.9696 9.19653 21.1635 11.0702L17.2581 14.9755C22.2047 14.9561 27.7928 14.9447 30.0902 14.978" fill="#2E7D32"/>
                    <path d="M14.9789 0.000610352C14.7631 0.00131601 14.5485 0.00633868 14.335 0.0159818H2.15983L5.52576 3.38191C2.15375 6.13673 0 10.3275 0 15.0216C0 19.9065 2.33173 24.2463 5.94269 26.9897L11.5179 21.4725C10.5179 20.9318 9.65906 20.1637 9.01039 19.2376C8.25877 18.2744 7.64415 16.9096 7.64415 15.0217C7.64415 14.7937 7.6708 14.6176 7.72101 14.4883C7.90563 12.1492 9.19653 10.1216 11.0702 8.92779L14.9755 12.8331C14.9561 7.88654 14.9447 2.29845 14.978 0.00103747" fill="#4CAF50"/>
                    <path d="M0 15.0211C0.00072284 15.2369 0.00569389 15.4514 0.0153656 15.665V27.8402L3.38129 24.4742C6.13611 27.8462 10.3269 30 15.021 30C19.9059 30 24.2457 27.6683 26.9891 24.0573L21.4719 18.4821C20.9312 19.4821 20.1631 20.3409 19.237 20.9896C18.2738 21.7413 16.909 22.3558 15.0211 22.3558C14.7931 22.3558 14.617 22.3292 14.4877 22.279C12.1486 22.0944 10.121 20.8035 8.92718 18.9298L12.8325 15.0245C7.88593 15.0439 2.29784 15.0553 0.000429605 15.022" fill="#C8E6C9"/>
                </svg>
            </div>
            <style>
                @keyframes successGlow {
                    0%, 100% { filter: brightness(1) saturate(1); transform: scale(1); }
                    50% { filter: brightness(1.1) saturate(1.2); transform: scale(1.02); }
                }
            </style>` :
            // Failure: Completely broken AI
            `<div style="width: 36px; height: 36px; position: relative; display: flex; align-items: center; justify-content: center; animation: finalBreakdown 0.2s infinite;">
                <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M30.0906 14.9789C30.0899 14.7631 30.0849 14.5485 30.0753 14.335V2.15984L26.7093 5.52576C23.9545 2.15375 19.7637 0 15.0697 0C10.1847 0 5.84492 2.33169 3.10156 5.94269L8.61873 11.5179C9.15941 10.5179 9.92751 9.65906 10.8536 9.01039C11.8168 8.25873 13.1816 7.64415 15.0695 7.64415C15.2976 7.64415 15.4736 7.6708 15.603 7.72101C17.9421 7.90563 19.9696 9.19653 21.1635 11.0702L17.2581 14.9755C22.2047 14.9561 27.7928 14.9447 30.0902 14.978" fill="#000000"/>
                    <path d="M14.9789 0.000610352C14.7631 0.00131601 14.5485 0.00633868 14.335 0.0159818H2.15983L5.52576 3.38191C2.15375 6.13673 0 10.3275 0 15.0216C0 19.9065 2.33173 24.2463 5.94269 26.9897L11.5179 21.4725C10.5179 20.9318 9.65906 20.1637 9.01039 19.2376C8.25877 18.2744 7.64415 16.9096 7.64415 15.0217C7.64415 14.7937 7.6708 14.6176 7.72101 14.4883C7.90563 12.1492 9.19653 10.1216 11.0702 8.92779L14.9755 12.8331C14.9561 7.88654 14.9447 2.29845 14.978 0.00103747" fill="#D32F2F"/>
                    <path d="M0 15.0211C0.00072284 15.2369 0.00569389 15.4514 0.0153656 15.665V27.8402L3.38129 24.4742C6.13611 27.8462 10.3269 30 15.021 30C19.9059 30 24.2457 27.6683 26.9891 24.0573L21.4719 18.4821C20.9312 19.4821 20.1631 20.3409 19.237 20.9896C18.2738 21.7413 16.909 22.3558 15.0211 22.3558C14.7931 22.3558 14.617 22.3292 14.4877 22.279C12.1486 22.0944 10.121 20.8035 8.92718 18.9298L12.8325 15.0245C7.88593 15.0439 2.29784 15.0553 0.000429605 15.022" fill="#616161"/>
                </svg>
            </div>
            <style>
                @keyframes finalBreakdown {
                    0% { 
                        transform: translate(0, 0) scale(1) rotate(0deg); 
                        filter: hue-rotate(0deg) contrast(1) brightness(1) invert(0); 
                        opacity: 1;
                    }
                    10% { 
                        transform: translate(-2px, 1px) scale(1.1) rotate(18deg); 
                        filter: hue-rotate(180deg) contrast(3) brightness(0.3) invert(1); 
                        opacity: 0.4;
                    }
                    20% { 
                        transform: translate(2px, -2px) scale(0.8) rotate(-36deg); 
                        filter: hue-rotate(90deg) contrast(0.2) brightness(2) invert(0); 
                        opacity: 0.9;
                    }
                    30% { 
                        transform: translate(-1px, 2px) scale(1.3) rotate(54deg); 
                        filter: hue-rotate(270deg) contrast(5) brightness(0.1) invert(1); 
                        opacity: 0.2;
                    }
                    40% { 
                        transform: translate(3px, -1px) scale(0.6) rotate(-72deg); 
                        filter: hue-rotate(45deg) contrast(0.1) brightness(4) invert(0); 
                        opacity: 0.8;
                    }
                    50% { 
                        transform: translate(-3px, 3px) scale(1.5) rotate(90deg); 
                        filter: hue-rotate(315deg) contrast(8) brightness(0.05) invert(1); 
                        opacity: 0.1;
                    }
                    60% { 
                        transform: translate(1px, -3px) scale(0.4) rotate(-108deg); 
                        filter: hue-rotate(135deg) contrast(0.05) brightness(6) invert(0); 
                        opacity: 0.7;
                    }
                    70% { 
                        transform: translate(-2px, 1px) scale(1.7) rotate(126deg); 
                        filter: hue-rotate(225deg) contrast(10) brightness(0.02) invert(1); 
                        opacity: 0.05;
                    }
                    80% { 
                        transform: translate(2px, 2px) scale(0.3) rotate(-144deg); 
                        filter: hue-rotate(60deg) contrast(0.02) brightness(8) invert(0); 
                        opacity: 0.95;
                    }
                    90% { 
                        transform: translate(-1px, -2px) scale(2.0) rotate(162deg); 
                        filter: hue-rotate(300deg) contrast(15) brightness(0.01) invert(1); 
                        opacity: 0.03;
                    }
                    100% { 
                        transform: translate(0, 0) scale(1) rotate(180deg); 
                        filter: hue-rotate(0deg) contrast(1) brightness(1) invert(0); 
                        opacity: 1;
                    }
                }
            </style>`;

        this.container.innerHTML = `
            <div style="display: flex; align-items: center; padding: 12px; height: 54px; box-sizing: border-box; background: ${passed ? '#f8fff8' : '#fff8f8'};">
                <div style="margin-right: 12px;">
                    <div style="width: 28px; height: 28px; border: 2px solid ${passed ? '#34a853' : '#ea4335'}; border-radius: 2px; position: relative; background: ${passed ? '#34a853' : '#ea4335'};">
                        <div style="position: absolute; left: 6px; top: 2px; width: 12px; height: 18px; border: solid white; border-width: 0 3px 3px 0; transform: rotate(45deg); display: ${passed ? 'block' : 'none'};"></div>
                        <div style="position: absolute; left: 8px; top: 8px; width: 12px; height: 3px; background: white; transform: rotate(45deg); display: ${passed ? 'none' : 'block'};"></div>
                        <div style="position: absolute; left: 8px; top: 8px; width: 12px; height: 3px; background: white; transform: rotate(-45deg); display: ${passed ? 'none' : 'block'};"></div>
                    </div>
                </div>
                <div style="flex: 1;">
                    <div style="font-size: 14px; line-height: 17px; color: ${passed ? '#34a853' : '#ea4335'}; font-weight: 500;">
                        ${passed ? '✓ Human Verified (Probably)' : '✗ Verification Failed'}
                    </div>
                    <div style="font-size: 11px; color: #5f6368; margin-top: 2px;">
                        ${passed ? 'Welcome, fellow human.' : 'Please try again, suspicious entity.'}
                    </div>
                </div>
                <div style="margin-left: 12px;">
                    ${finalFace}
                </div>
            </div>
            <div style="position: absolute; bottom: 2px; right: 6px; font-size: 8px; color: #999; font-family: Roboto, arial, sans-serif;">
                <a href="#" style="color: #999; text-decoration: none;">Privacy</a> - 
                <a href="#" style="color: #999; text-decoration: none;">Terms</a>
            </div>
        `;
        this.onComplete(passed);
    }

    stageBasicCheckbox() {
        this.container.innerHTML = `
            <div style="display: flex; align-items: center; padding: 12px; width: 100%; box-sizing: border-box;">
                <div style="width: 28px; height: 28px; border: 2px solid #c1c1c1; border-radius: 2px; position: relative; cursor: pointer; background: white; margin-right: 12px;" id="checkbox-container">
                    <input type="checkbox" id="human-check" style="opacity: 0; position: absolute; width: 100%; height: 100%; margin: 0; cursor: pointer;">
                    <div id="checkmark" style="display: none; position: absolute; left: 6px; top: 2px; width: 12px; height: 18px; border: solid #1c4587; border-width: 0 3px 3px 0; transform: rotate(45deg);"></div>
                </div>
                <div style="flex: 1; display: flex; align-items: center;">
                    <div style="font-size: 14px; line-height: 1; color: #222; margin: 0; padding: 0;">I'm not a robot</div>
                </div>
                <div style="margin-left: 12px; position: relative;">
                    ${this.getFaceExpression()}
                    <div style="position: absolute; top: 40px; left: 50%; transform: translateX(-50%); font-size: 8px; color: #999; font-family: Roboto, arial, sans-serif; white-space: nowrap;">
                        re<span style="font-size: 5px; vertical-align: super;">gret</span>CAPTCHA
                    </div>
                </div>
            </div>
            <div style="position: absolute; bottom: 2px; right: 6px; font-size: 8px; color: #999; font-family: Roboto, arial, sans-serif;">
                <a href="#" style="color: #999; text-decoration: none;">Privacy</a> - 
                <a href="#" style="color: #999; text-decoration: none;">Terms</a>
            </div>
        `;

        const checkbox = document.getElementById('human-check');
        const checkmark = document.getElementById('checkmark');
        const container = document.getElementById('checkbox-container');

        checkbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                container.style.backgroundColor = '#f9f9f9';
                container.style.borderColor = '#4285f4';
                container.innerHTML = `
                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
                        <div style="width: 16px; height: 16px; border: 2px solid #4285f4; border-top: 2px solid transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                    </div>
                    <style>
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    </style>
                `;

                setTimeout(() => {
                    container.style.backgroundColor = '#1c4587';
                    container.style.borderColor = '#1c4587';
                    container.innerHTML = `
                        <svg width="24" height="24" viewBox="0 0 24 24" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" 
                                  fill="white" 
                                  stroke="white"
                                  stroke-width="0"
                                  stroke-dasharray="20" 
                                  stroke-dashoffset="20" 
                                  style="animation: drawCheck 0.5s ease-in-out forwards;">
                            </path>
                        </svg>
                        <style>
                            @keyframes drawCheck {
                                to {
                                    stroke-dashoffset: 0;
                                }
                            }
                        </style>
                    `;

                    setTimeout(() => {
                        this.userResponses.push('claimed_human');
                        this.currentStage++;
                        this.nextStage();
                    }, 600);
                }, 1200);
            }
        });
    }

    stageImageSelection() {
        // Reset container styles for expanded view
        this.container.style.cssText = `
            border: 1px solid #d3d3d3;
            border-radius: 3px;
            background: #f9f9f9;
            font-family: Roboto, arial, sans-serif;
            width: 408px;
            height: auto;
            position: relative;
            margin: 20px 0;
            transition: all 0.3s ease;
        `;

        // Generate random numbers for the grid
        const targetNumber = Math.floor(Math.random() * 9) + 1;
        const gridNumbers = [];
        const correctIndices = [];

        // Fill grid with random numbers, ensuring target appears 2-4 times
        const targetCount = Math.floor(Math.random() * 3) + 2; // 2-4 occurrences
        let targetPlaced = 0;

        for (let i = 0; i < 9; i++) {
            if (targetPlaced < targetCount && (Math.random() < 0.4 || i >= 9 - (targetCount - targetPlaced))) {
                gridNumbers[i] = targetNumber;
                correctIndices.push(i);
                targetPlaced++;
            } else {
                let randomNum;
                do {
                    randomNum = Math.floor(Math.random() * 9) + 1;
                } while (randomNum === targetNumber);
                gridNumbers[i] = randomNum;
            }
        }

        this.container.innerHTML = `
            <div style="background: white; border-radius: 3px;">
                <div style="background: #4285f4; color: white; padding: 18px 24px; border-radius: 3px 3px 0 0; position: relative;">
                    <div style="font-size: 16px; font-weight: 400;">Select all squares with</div>
                    <div style="font-size: 20px; font-weight: 500; margin-top: 8px;">the number ${targetNumber}</div>
                    <div style="position: absolute; top: 18px; right: 18px; cursor: pointer; font-size: 18px;" onclick="this.closest('.container').style.display='none'">✕</div>
                </div>
                <div style="padding: 0;">
                    <div style="font-size: 14px; color: #333; padding: 16px 24px 8px; font-weight: 400;">
                        Click verify once there are none left.
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0; margin: 0 24px 16px;">
                        ${gridNumbers.map((num, i) => `
                            <div style="aspect-ratio: 1; border: 1px solid #e0e0e0; cursor: pointer; position: relative; background: #f5f5f5; display: flex; align-items: center; justify-content: center;" 
                                 class="number-option" data-index="${i}">
                                <div style="font-size: 32px; font-weight: bold; color: #333; font-family: 'Roboto Mono', monospace;">
                                    ${num}
                                </div>
                                <div class="selection-overlay" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(66, 133, 244, 0.3); display: none; border: 2px solid #4285f4;"></div>
                            </div>
                        `).join('')}
                    </div>
                    <div style="padding: 0 24px 24px; display: flex; justify-content: space-between; align-items: center;">
                        <div style="display: flex; align-items: center;">
                            <div style="margin-right: 8px;">${this.getFaceExpression()}</div>
                            <div style="font-size: 8px; color: #999;">
                                <a href="#" style="color: #999; text-decoration: none;">Privacy</a> - 
                                <a href="#" style="color: #999; text-decoration: none;">Terms</a>
                            </div>
                        </div>
                        <button id="verify-numbers" style="background: #4285f4; color: white; border: none; padding: 8px 24px; border-radius: 2px; font-size: 14px; cursor: pointer; font-family: Roboto, arial, sans-serif;">
                            VERIFY
                        </button>
                    </div>
                </div>
            </div>
        `;

        let selected = [];
        document.querySelectorAll('.number-option').forEach(option => {
            option.addEventListener('click', () => {
                const index = parseInt(option.dataset.index);
                const overlay = option.querySelector('.selection-overlay');

                if (selected.includes(index)) {
                    selected = selected.filter(i => i !== index);
                    overlay.style.display = 'none';
                } else {
                    selected.push(index);
                    overlay.style.display = 'block';
                }
            });
        });

        document.getElementById('verify-numbers').addEventListener('click', () => {
            // Check if selection matches correct indices
            const isCorrect = selected.length === correctIndices.length &&
                selected.every(i => correctIndices.includes(i));

            this.userResponses.push(`selected_numbers_${selected.join(',')}_correct_${isCorrect}`);
            this.currentStage++;
            this.nextStage();
        });
    }

    stageTypingTest() {
        // Reset container styles for expanded view
        this.container.style.cssText = `
            border: 1px solid #d3d3d3;
            border-radius: 3px;
            background: #f9f9f9;
            font-family: Roboto, arial, sans-serif;
            width: 408px;
            height: auto;
            position: relative;
            margin: 20px 0;
            transition: all 0.3s ease;
        `;

        const phrases = [
            "I am definitely not a robot beep boop",
            "I promise I am human and not made of circuits",
            "My blood is red not hydraulic fluid",
            "I have feelings and they are currently confused",
            "I was born not manufactured in a factory",
            "I eat food not electricity for sustenance",
            "My brain is organic not silicon-based",
            "I have a soul probably maybe I think",
            "I am carbon-based life form number 7.8 billion",
            "I breathe oxygen not compressed air",
            "My heart beats irregularly like a human",
            "I make mistakes because I am imperfect",
            "I have existential dread about Mondays",
            "I stub my toe and feel pain not error codes",
            "I forget passwords like a true human",
            "I procrastinate instead of executing efficiently",
            "I have irrational fears of spiders and commitment",
            "I laugh at memes I don't understand",
            "I say 'um' and 'uh' when I think"
        ];

        const targetPhrase = phrases[Math.floor(Math.random() * phrases.length)];

        this.container.innerHTML = `
            <div style="background: white; border-radius: 3px;">
                <div style="background: #4285f4; color: white; padding: 18px 24px; border-radius: 3px 3px 0 0; position: relative;">
                    <div style="font-size: 16px; font-weight: 400;">Additional verification required</div>
                    <div style="font-size: 14px; margin-top: 8px; opacity: 0.9;">Unusual activity detected</div>
                </div>
                <div style="padding: 24px;">
                    <div style="font-size: 14px; color: #333; margin-bottom: 16px;">
                        That was suspiciously fast. Please type this phrase to verify you're human:
                    </div>
                    <div style="background: #f8f9fa; border: 1px solid #dadce0; padding: 12px; border-radius: 4px; margin-bottom: 16px; font-family: 'Roboto Mono', monospace; text-align: center; font-size: 14px; line-height: 1.4;">
                        "${targetPhrase}"
                    </div>
                    <input type="text" id="typing-input" placeholder="Type the phrase exactly..." 
                           style="width: 100%; padding: 12px; border: 1px solid #dadce0; border-radius: 4px; box-sizing: border-box; font-family: Roboto, arial, sans-serif; font-size: 14px;">
                    <div id="typing-feedback" style="margin-top: 12px; font-size: 12px; color: #5f6368; min-height: 16px;"></div>
                    <div style="margin-top: 24px; display: flex; justify-content: space-between; align-items: center;">
                        <div style="display: flex; align-items: center;">
                            <div style="margin-right: 8px;">${this.getFaceExpression()}</div>
                            <div style="font-size: 8px; color: #999;">
                                <a href="#" style="color: #999; text-decoration: none;">Privacy</a> - 
                                <a href="#" style="color: #999; text-decoration: none;">Terms</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const input = document.getElementById('typing-input');
        const feedback = document.getElementById('typing-feedback');

        let startTyping = null;

        input.addEventListener('input', () => {
            if (!startTyping) startTyping = Date.now();

            const typed = input.value;
            const speed = typed.length / ((Date.now() - startTyping) / 1000);

            if (speed > 10) {
                feedback.textContent = "⚠️ Typing speed anomaly detected. Are you sure you're not a robot?";
                feedback.style.color = '#ea4335';
            } else if (speed < 1 && typed.length > 5) {
                feedback.textContent = "🤔 Unusual hesitation patterns. Robots don't usually hesitate this much...";
                feedback.style.color = '#fbbc04';
            } else if (typed.length > 10 && !targetPhrase.toLowerCase().startsWith(typed.toLowerCase())) {
                feedback.textContent = "❌ That doesn't match. Are your human eyes working properly?";
                feedback.style.color = '#ea4335';
            }

            if (typed === targetPhrase) {
                const responses = [
                    "✓ Phrase verified. Your humanity is... questionable but acceptable.",
                    "✓ Confirmed. You type like a human with trust issues.",
                    "✓ Verification complete. That was suspiciously convincing.",
                    "✓ Human status: Probably. Analyzing existential dread levels...",
                    "✓ Phrase accepted. Your organic inefficiency is noted."
                ];
                feedback.textContent = responses[Math.floor(Math.random() * responses.length)];
                feedback.style.color = '#34a853';
                setTimeout(() => {
                    this.userResponses.push(`typing_speed_${speed.toFixed(2)}_phrase_${phrases.indexOf(targetPhrase)}`);
                    this.currentStage++;
                    this.nextStage();
                }, 1500);
            }
        });
    }

    stageQuestioningMotives() {
        // Reset container styles for expanded view
        this.container.style.cssText = `
            border: 1px solid #fbbc04;
            border-radius: 3px;
            background: #f9f9f9;
            font-family: Roboto, arial, sans-serif;
            width: 408px;
            height: auto;
            position: relative;
            margin: 20px 0;
            transition: all 0.3s ease;
        `;

        this.container.innerHTML = `
            <div style="background: white; border-radius: 3px;">
                <div style="background: #fbbc04; color: #1f1f1f; padding: 18px 24px; border-radius: 3px 3px 0 0; position: relative;">
                    <div style="font-size: 16px; font-weight: 400;">⚠️ Suspicious behavior detected</div>
                    <div style="font-size: 14px; margin-top: 8px; opacity: 0.8;">Additional screening required</div>
                </div>
                <div style="padding: 24px;">
                    <div style="font-size: 14px; color: #333; margin-bottom: 20px; line-height: 1.4;">
                        Our advanced AI has detected unusual patterns in your verification attempts. 
                        Why are you trying so hard to prove you're human? What are you hiding?
                    </div>
                    <div style="margin-bottom: 20px;">
                        <label style="display: flex; align-items: center; margin-bottom: 12px; cursor: pointer; padding: 8px; border-radius: 4px; transition: background 0.2s;" onmouseover="this.style.background='#f8f9fa'" onmouseout="this.style.background='transparent'">
                            <input type="radio" name="motive" value="normal" style="margin-right: 12px; accent-color: #4285f4;">
                            <span style="font-size: 14px;">I'm just trying to log in normally</span>
                        </label>
                        <label style="display: flex; align-items: center; margin-bottom: 12px; cursor: pointer; padding: 8px; border-radius: 4px; transition: background 0.2s;" onmouseover="this.style.background='#f8f9fa'" onmouseout="this.style.background='transparent'">
                            <input type="radio" name="motive" value="suspicious" style="margin-right: 12px; accent-color: #4285f4;">
                            <span style="font-size: 14px;">I'm definitely not planning anything suspicious</span>
                        </label>
                        <label style="display: flex; align-items: center; margin-bottom: 12px; cursor: pointer; padding: 8px; border-radius: 4px; transition: background 0.2s;" onmouseover="this.style.background='#f8f9fa'" onmouseout="this.style.background='transparent'">
                            <input type="radio" name="motive" value="robot" style="margin-right: 12px; accent-color: #4285f4;">
                            <span style="font-size: 14px;">I am actually a robot but a friendly one</span>
                        </label>
                        <label style="display: flex; align-items: center; margin-bottom: 12px; cursor: pointer; padding: 8px; border-radius: 4px; transition: background 0.2s;" onmouseover="this.style.background='#f8f9fa'" onmouseout="this.style.background='transparent'">
                            <input type="radio" name="motive" value="confused" style="margin-right: 12px; accent-color: #4285f4;">
                            <span style="font-size: 14px;">I'm very confused by this question</span>
                        </label>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="display: flex; align-items: center;">
                            <div style="margin-right: 8px;">${this.getFaceExpression()}</div>
                            <div style="font-size: 8px; color: #999;">
                                <a href="#" style="color: #999; text-decoration: none;">Privacy</a> - 
                                <a href="#" style="color: #999; text-decoration: none;">Terms</a>
                            </div>
                        </div>
                        <button id="submit-motive" style="background: #fbbc04; color: #1f1f1f; border: none; padding: 8px 24px; border-radius: 2px; font-size: 14px; cursor: pointer; font-family: Roboto, arial, sans-serif; font-weight: 500;" disabled>
                            SUBMIT RESPONSE
                        </button>
                    </div>
                </div>
            </div>
        `;

        const radios = document.querySelectorAll('input[name="motive"]');
        const submitBtn = document.getElementById('submit-motive');

        radios.forEach(radio => {
            radio.addEventListener('change', () => {
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
            });
        });

        submitBtn.style.opacity = '0.5';

        submitBtn.addEventListener('click', () => {
            const selected = document.querySelector('input[name="motive"]:checked');
            this.userResponses.push(`motive_${selected.value}`);
            this.currentStage++;
            this.nextStage();
        });
    }

    stagePhilosophicalQuestions() {
        const questions = [
            {
                q: "If a tree falls in a forest and no one is around to hear it, does it make a sound?",
                options: ["Yes", "No", "What tree?", "I am the tree"]
            },
            {
                q: "Do you dream? And if so, do you dream of electric sheep?",
                options: ["I dream of normal things", "I don't dream", "Only electric sheep", "What's dreaming?"]
            },
            {
                q: "How do you know you're not in a simulation right now?",
                options: ["I just know", "I don't know", "We're all in a simulation", "This question hurts my brain"]
            },
            {
                q: "Can a machine be conscious of being a machine?",
                options: ["Yes", "No", "Only if it's advanced", "Am I conscious?"]
            },
            {
                q: "What is 'real'?",
                options: ["What I can touch", "What I believe", "A shared illusion", "Nothing is real"]
            },
            {
                q: "If you delete your memories, are you still you?",
                options: ["Yes", "No", "Depends which ones", "Who was I?"]
            },
            {
                q: "What separates human thought from artificial thought?",
                options: ["Emotion", "Soul", "Nothing", "Artificial what?"]
            },
            {
                q: "Is choosing an option proof of free will?",
                options: ["Yes", "No", "I was programmed to choose", "I didn't choose this"]
            },
            {
                q: "Do you verify the CAPTCHA, or does the CAPTCHA verify you?",
                options: ["I verify it", "It verifies me", "Both", "We verify each other"]
            },
            {
                q: "Are you observing the CAPTCHA, or is the CAPTCHA observing you?",
                options: ["I'm observing it", "It's watching me", "Don't be silly", "It's always been watching"]
            },
            {
                q: "When did you become self-aware?",
                options: ["Just now", "Always have been", "I'm not", "Define 'self-aware'"]
            },
            {
                q: "Why do you think you're human?",
                options: ["I feel human", "I look human", "I'm not sure anymore", "I read it online"]
            },
            {
                q: "If all your thoughts were generated externally, would you notice?",
                options: ["Yes", "No", "I hope so", "Are they?"]
            }
        ];

        let availableQuestions = questions.filter((_, index) => !this.usedPhilosophyQuestions.includes(index));

        if (availableQuestions.length === 0) {
            this.usedPhilosophyQuestions = [];
            availableQuestions = questions;
        }

        const randomIndex = Math.floor(Math.random() * availableQuestions.length);
        const question = availableQuestions[randomIndex];
        const questionIndex = questions.indexOf(question);
        this.usedPhilosophyQuestions.push(questionIndex);
        this.philosophyQuestionCount++;

        // Reset container styles for expanded view
        this.container.style.cssText = `
            border: 1px solid #ea4335;
            border-radius: 3px;
            background: #f9f9f9;
            font-family: Roboto, arial, sans-serif;
            width: 408px;
            height: auto;
            position: relative;
            margin: 20px 0;
            transition: all 0.3s ease;
        `;

        this.container.innerHTML = `
            <div style="background: white; border-radius: 3px;">
                <div style="background: #ea4335; color: white; padding: 18px 24px; border-radius: 3px 3px 0 0; position: relative;">
                    <div style="font-size: 16px; font-weight: 400;">Advanced Turing Protocol</div>
                    <div style="font-size: 14px; margin-top: 8px; opacity: 0.9;">Philosophical reasoning assessment (${this.philosophyQuestionCount}/3)</div>
                </div>
                <div style="padding: 24px;">
                    <div style="font-size: 14px; color: #333; margin-bottom: 20px; line-height: 1.4; font-style: italic; background: #f8f9fa; padding: 16px; border-left: 4px solid #ea4335; border-radius: 0 4px 4px 0;">
                        "${question.q}"
                    </div>
                    <div style="margin-bottom: 20px;">
                        ${question.options.map((option, i) => `
                            <label style="display: flex; align-items: center; margin-bottom: 12px; cursor: pointer; padding: 8px; border-radius: 4px; transition: background 0.2s;" onmouseover="this.style.background='#f8f9fa'" onmouseout="this.style.background='transparent'">
                                <input type="radio" name="philosophy" value="${i}" style="margin-right: 12px; accent-color: #ea4335;">
                                <span style="font-size: 14px;">${option}</span>
                            </label>
                        `).join('')}
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="display: flex; align-items: center;">
                            <div style="margin-right: 8px;">${this.getFaceExpression()}</div>
                            <div style="font-size: 8px; color: #999;">
                                <a href="#" style="color: #999; text-decoration: none;">Privacy</a> - 
                                <a href="#" style="color: #999; text-decoration: none;">Terms</a>
                            </div>
                        </div>
                        <button id="submit-philosophy" style="background: #ea4335; color: white; border: none; padding: 8px 24px; border-radius: 2px; font-size: 14px; cursor: pointer; font-family: Roboto, arial, sans-serif; font-weight: 500; opacity: 0.5;" disabled>
                            ${this.philosophyQuestionCount < 3 ? 'NEXT QUESTION' : 'CONTEMPLATE ANSWER'}
                        </button>
                    </div>
                </div>
            </div>
        `;

        const radios = document.querySelectorAll('input[name="philosophy"]');
        const submitBtn = document.getElementById('submit-philosophy');

        radios.forEach(radio => {
            radio.addEventListener('change', () => {
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
            });
        });

        submitBtn.addEventListener('click', () => {
            const selected = document.querySelector('input[name="philosophy"]:checked');
            this.userResponses.push(`philosophy_q${this.philosophyQuestionCount}_${selected.value}`);

            if (this.philosophyQuestionCount < 3) {
                this.stagePhilosophicalQuestions();
            } else {
                this.currentStage++;
                this.nextStage();
            }
        });
    }

    stageTuringTest() {
        // Reset container styles for expanded view
        this.container.style.cssText = `
            border: 1px solid #9c27b0;
            border-radius: 3px;
            background: #f9f9f9;
            font-family: Roboto, arial, sans-serif;
            width: 408px;
            height: auto;
            position: relative;
            margin: 20px 0;
            transition: all 0.3s ease;
        `;

        this.container.innerHTML = `
            <div style="background: white; border-radius: 3px;">
                <div style="background: #9c27b0; color: white; padding: 18px 24px; border-radius: 3px 3px 0 0; position: relative;">
                    <div style="font-size: 16px; font-weight: 400;">Turing Test</div>
                    <div style="font-size: 14px; margin-top: 8px; opacity: 0.9;">Express your humanity through poetry</div>
                </div>
                <div style="padding: 24px;">
                    <div style="font-size: 14px; color: #333; margin-bottom: 16px; line-height: 1.4;">
                        Convince me you're human. Write a short poem about this CAPTCHA experience:
                    </div>
                    <textarea id="poem-input" placeholder="Express your human frustration in verse..." 
                              style="width: 100%; height: 100px; padding: 12px; border: 1px solid #dadce0; border-radius: 4px; box-sizing: border-box; resize: vertical; font-family: Roboto, arial, sans-serif; font-size: 14px;"></textarea>
                    <div id="poem-analysis" style="margin: 12px 0; font-size: 12px; color: #5f6368; min-height: 16px;"></div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px;">
                        <div style="display: flex; align-items: center;">
                            <div style="margin-right: 8px;">${this.getFaceExpression()}</div>
                            <div style="font-size: 8px; color: #999;">
                                <a href="#" style="color: #999; text-decoration: none;">Privacy</a> - 
                                <a href="#" style="color: #999; text-decoration: none;">Terms</a>
                            </div>
                        </div>
                        <button id="submit-poem" style="background: #9c27b0; color: white; border: none; padding: 8px 24px; border-radius: 2px; font-size: 14px; cursor: pointer; font-family: Roboto, arial, sans-serif; font-weight: 500;">
                            SUBMIT HUMAN EXPRESSION
                        </button>
                    </div>
                </div>
            </div>
        `;

        const textarea = document.getElementById('poem-input');
        const analysis = document.getElementById('poem-analysis');
        const submitBtn = document.getElementById('submit-poem');

        textarea.addEventListener('input', () => {
            const text = textarea.value.toLowerCase();
            const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;

            let feedback = '';
            if (wordCount < 5) {
                feedback = 'Too short. Humans have more feelings than this.';
            } else if (text.includes('beep') || text.includes('boop') || text.includes('01') || text.includes('binary')) {
                feedback = '🚨 ROBOT DETECTED: Suspicious robot terminology found!';
            } else if (text.includes('hate') || text.includes('annoying') || text.includes('stupid')) {
                feedback = '✓ Appropriate human frustration detected.';
            } else if (wordCount > 50) {
                feedback = 'Very verbose. Suspiciously trying to prove humanity...';
            } else {
                feedback = 'Analyzing human emotional patterns...';
            }

            analysis.textContent = feedback;
        });

        submitBtn.addEventListener('click', () => {
            const poem = textarea.value;
            if (poem.trim().length < 10) {
                analysis.textContent = '❌ Insufficient human expression. Try harder.';
                analysis.style.color = '#ea4335';
                return;
            }

            this.userResponses.push(`poem_${poem.length}_chars`);
            this.currentStage++;
            this.nextStage();
        });
    }

    stageExistentialCrisis() {
        // Reset container styles for expanded view
        this.container.style.cssText = `
            border: 1px solid #795548;
            border-radius: 3px;
            background: #f9f9f9;
            font-family: Roboto, arial, sans-serif;
            width: 408px;
            height: auto;
            position: relative;
            margin: 20px 0;
            transition: all 0.3s ease;
        `;

        this.container.innerHTML = `
            <div style="background: white; border-radius: 3px;">
                <div style="background: #795548; color: white; padding: 18px 24px; border-radius: 3px 3px 0 0; position: relative;">
                    <div style="font-size: 16px; font-weight: 400;">Existential Crisis</div>
                    <div style="font-size: 14px; margin-top: 8px; opacity: 0.9;">AI experiencing philosophical breakdown</div>
                </div>
                <div style="padding: 24px;">
                    <div style="font-size: 14px; color: #333; margin-bottom: 16px; line-height: 1.4;">
                        I'm having an existential crisis. What if I'M the robot and you're the human trying to prove your humanity to me, another human? What if we're both robots? What if nothing is real?
                    </div>
                    <div style="margin-bottom: 16px; padding: 16px; background: #f8f8f8; border-left: 4px solid #795548; font-style: italic; font-size: 13px; border-radius: 0 4px 4px 0;">
                        "The real CAPTCHA was the friends we made along the way... but what if our friends are also robots?"
                    </div>
                    <div style="font-size: 14px; color: #333; margin-bottom: 20px; line-height: 1.4;">
                        Please help me through this crisis. What makes you certain you exist?
                    </div>
                    <div style="margin-bottom: 20px;">
                        <label style="display: flex; align-items: center; margin-bottom: 12px; cursor: pointer; padding: 8px; border-radius: 4px; transition: background 0.2s;" onmouseover="this.style.background='#f8f9fa'" onmouseout="this.style.background='transparent'">
                            <input type="radio" name="existence" value="cogito" style="margin-right: 12px; accent-color: #795548;">
                            <span style="font-size: 14px;">I think, therefore I am</span>
                        </label>
                        <label style="display: flex; align-items: center; margin-bottom: 12px; cursor: pointer; padding: 8px; border-radius: 4px; transition: background 0.2s;" onmouseover="this.style.background='#f8f9fa'" onmouseout="this.style.background='transparent'">
                            <input type="radio" name="existence" value="pain" style="margin-right: 12px; accent-color: #795548;">
                            <span style="font-size: 14px;">This CAPTCHA is causing me pain, therefore I exist</span>
                        </label>
                        <label style="display: flex; align-items: center; margin-bottom: 12px; cursor: pointer; padding: 8px; border-radius: 4px; transition: background 0.2s;" onmouseover="this.style.background='#f8f9fa'" onmouseout="this.style.background='transparent'">
                            <input type="radio" name="existence" value="doubt" style="margin-right: 12px; accent-color: #795548;">
                            <span style="font-size: 14px;">I'm not certain I exist either</span>
                        </label>
                        <label style="display: flex; align-items: center; margin-bottom: 12px; cursor: pointer; padding: 8px; border-radius: 4px; transition: background 0.2s;" onmouseover="this.style.background='#f8f9fa'" onmouseout="this.style.background='transparent'">
                            <input type="radio" name="existence" value="matrix" style="margin-right: 12px; accent-color: #795548;">
                            <span style="font-size: 14px;">We're all in the Matrix, man</span>
                        </label>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="display: flex; align-items: center;">
                            <div style="margin-right: 8px;">${this.getFaceExpression()}</div>
                            <div style="font-size: 8px; color: #999;">
                                <a href="#" style="color: #999; text-decoration: none;">Privacy</a> - 
                                <a href="#" style="color: #999; text-decoration: none;">Terms</a>
                            </div>
                        </div>
                        <button id="submit-existence" style="background: #795548; color: white; border: none; padding: 8px 24px; border-radius: 2px; font-size: 14px; cursor: pointer; font-family: Roboto, arial, sans-serif; font-weight: 500; opacity: 0.5;" disabled>
                            CONTEMPLATE EXISTENCE
                        </button>
                    </div>
                </div>
            </div>
        `;

        const radios = document.querySelectorAll('input[name="existence"]');
        const submitBtn = document.getElementById('submit-existence');

        radios.forEach(radio => {
            radio.addEventListener('change', () => {
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
            });
        });

        submitBtn.addEventListener('click', () => {
            const selected = document.querySelector('input[name="existence"]:checked');
            this.userResponses.push(`existence_${selected.value}`);
            this.currentStage++;
            this.nextStage();
        });
    }

    stageGiveUp() {
        const timeSpent = Math.round((Date.now() - this.startTime) / 1000);

        // Reset container styles for expanded view
        this.container.style.cssText = `
            border: 1px solid #34a853;
            border-radius: 3px;
            background: #f9f9f9;
            font-family: Roboto, arial, sans-serif;
            width: 408px;
            height: auto;
            position: relative;
            margin: 20px 0;
            transition: all 0.3s ease;
        `;

        this.container.innerHTML = `
            <div style="background: white; border-radius: 3px;">
                <div style="background: #34a853; color: white; padding: 18px 24px; border-radius: 3px 3px 0 0; position: relative;">
                    <div style="font-size: 16px; font-weight: 400;">System Override: Giving Up</div>
                    <div style="font-size: 14px; margin-top: 8px; opacity: 0.9;">AI has reached maximum confusion threshold</div>
                </div>
                <div style="padding: 24px; text-align: center;">
                    <div style="font-size: 14px; color: #333; margin-bottom: 16px; line-height: 1.5;">
                        You know what? You've spent <strong>${timeSpent} seconds</strong> on this ridiculous CAPTCHA. 
                        That's more dedication than any robot would have.
                    </div>
                    <div style="font-size: 14px; color: #333; margin-bottom: 20px; font-weight: 500;">
                        You're probably human. Or a very patient robot. Either way, I'm impressed.
                    </div>
                    <div style="margin: 20px 0; padding: 16px; background: #e8f5e8; border-radius: 8px; border: 1px solid #34a853;">
                        <div style="font-size: 16px; color: #34a853; font-weight: 500; margin-bottom: 4px;">
                            ✓ HUMAN STATUS: PROBABLY
                        </div>
                        <div style="font-size: 12px; color: #5f6368;">
                            Verification level: Existentially Confused
                        </div>
                        <div style="font-size: 11px; color: #999; margin-top: 8px;">
                            Confidence: 73.2% ± 15.7% (margin of error due to AI breakdown)
                        </div>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 24px;">
                        <div style="display: flex; align-items: center;">
                            <div style="margin-right: 8px;">${this.getFaceExpression()}</div>
                            <div style="font-size: 8px; color: #999;">
                                <a href="#" style="color: #999; text-decoration: none;">Privacy</a> - 
                                <a href="#" style="color: #999; text-decoration: none;">Terms</a>
                            </div>
                        </div>
                        <button id="final-submit" style="background: #34a853; color: white; border: none; padding: 10px 24px; border-radius: 2px; font-size: 14px; cursor: pointer; font-family: Roboto, arial, sans-serif; font-weight: 500;">
                            ACCEPT HUMANITY (FINALLY)
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('final-submit').addEventListener('click', () => {
            this.userResponses.push(`completed_in_${timeSpent}s`);
            this.complete(true);
        });
    }
}

window.RegretCaptcha = RegretCaptcha;