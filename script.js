function checkAttendanceListImage() {
    const attendanceListImage = document.getElementById('imageUpload');
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
            console.log("last names:", lastNames)
    
            result.innerText = lastNames.join(', ');
        });
    } else {
        alert("Uploaded image is required");
    }
}
