        const text1 = "Budi izvrstan u onom što voliš.";
        const text2 = "ZAISKRI";
        const dot = ".";

        const line1El = document.getElementById("line1");
        const line2El = document.getElementById("line2");

        let i = 0;
        let step = 1;

        function type() {
            
            if (step === 1) {

                if (i <= text1.length) {
                    line1El.innerHTML = text1.slice(0, i) + '<span class="cursor" style="color:white"></span>';
                    i++;
                    setTimeout(type, 90);
                } else {
                    step = 2;
                    i = 0;
                    line1El.innerHTML = text1; 
                    setTimeout(type, 600);
                }
                return;
            }

            
            if (step === 2) {

                if (i <= text2.length + dot.length) {
                    const typedWord = text2.slice(0, i);
                    const typedDot = i > text2.length ? "." : "";

                    line2El.innerHTML =
                        `<span class="zaiskri">${typedWord}</span>` +
                        `<span class="white">${typedDot}</span>` +
                        '<span class="cursor" style="color:white"></span>';

                    i++;
                    setTimeout(type, 110);
                } else {
                    // kursor stoji
                    line2El.innerHTML =
                        `<span class="zaiskri">${text2}</span>` +
                        `<span class="white">${dot}</span>` +
                        '<span class="cursor" style="color:white"></span>';
                }
                return;
            }
        }

        type();