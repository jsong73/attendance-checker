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
    
            result.innerText = `\n\nLast Names from Attendance List: ${lastNames.join(', ')}`;
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

                zoomLastNames = lastNames;

                console.log("last names:", lastNames)

                result.innerText += `\n\nLast Names from Zoom List: ${lastNames.join(', ')}`;
            });
        });
    } else {
        alert("Uploaded image are required");
    }

}


function compareAttendanceAndZoom() {
    const result = document.getElementById('result');
    console.log('Attendance Last Names:', attendanceLastNames);
    console.log('Zoom Last Names:', zoomLastNames);

    if (attendanceLastNames.length === 0 || zoomLastNames.length === 0) {
        alert('Please upload both attendance and Zoom lists before comparing.');
        return;
    }

    //toLowerCase 
    const lowerCaseAttendanceLastNames = attendanceLastNames.map((name) => name.toLowerCase());
    const lowerCaseZoomLastNames = zoomLastNames.map((name) => name.toLowerCase());

    // Find absent students (present in attendance, not in Zoom)
    const absentLastNames = lowerCaseAttendanceLastNames.filter(
        (lastName) => !lowerCaseZoomLastNames.includes(lastName)
    );

    if (absentLastNames.length === 0) {
        result.innerText += '\n\nAll students are present in the Zoom list.';
    } else {
        result.innerText += `\n\nAbsent Last Names: ${absentLastNames.join(', ')}`;
    }
}