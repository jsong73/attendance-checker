let attendanceLastNames = [];
let zoomLastNames = [];

function checkAttendanceListImage() {
    const attendanceListImage = document.getElementById('attendanceImageUpload');
    const result = document.getElementById('result');

    if (attendanceListImage.files.length > 0) {
        const file = attendanceListImage.files[0];
        const imageUrl = URL.createObjectURL(file);

        Tesseract.recognize(
            imageUrl,
            'eng',
            { logger: m => console.log(m) }
        ).then(({ data: { text } }) => {
            // console.log(text);

            // Split the text into seperate lines
            const seperatedNames = text.split('\n');
            // console.log(seperatedNames)

            // grab last name by filtering through names and splitting at comma or period
            const lastNames = seperatedNames.map(names => {
                const filteredNames = names.split(/[,.]\s*/);
                //grabs just the last name since format is last name, first name
                return filteredNames[0].trim(); 
            // removes empty strings from lastNames array
            }).filter(name => name);

            attendanceLastNames = lastNames;
            console.log("last names:", lastNames)
    
            result.innerText = `Last Names from Attendance List: ${lastNames.join(', ')}`;
        });
    } else {
        alert("Uploaded image is required");
    }
}

function checkZoomListImage() {
    const zoomImageUpload = document.getElementById("zoomImageUpload");
    const result = document.getElementById("result");

    if (zoomImageUpload.files.length > 0) {
        const zoomImages = Array.from(zoomImageUpload.files);

        zoomImages.forEach((zoomImage, index) => {
            const imageUrl = URL.createObjectURL(zoomImage);

            Tesseract.recognize(
                imageUrl,
                'eng',
                { logger: m => console.log(m) }
            ).then(({ data: { text } }) => {
                console.log(text);

                const seperatedNames = text.split('\n');
     
        
                const lastNames = seperatedNames.map(name => {
                    const filteredNames = name.split(/[,.]\s*/);
                    const lastName = filteredNames[0].trim();

                    //removing TA's and instructors from array
                    const excludedNames = ["Chad Hinds(TA)", "Jessca Song(14)", "Andy --TA", "Junghoon Yoon"];
                    if (!excludedNames.includes(lastName)) {
                        return lastName;
                    }
                    return null;
                }).filter(name => name);

                attendanceLastNames = lastNames;

                console.log("last names:", lastNames)

                result.innerText = `Last Names from Zoom List: ${lastNames.join(', ')}`;
        
            });
        });
    } else {
        alert("Uploaded image are required");
    }


}


