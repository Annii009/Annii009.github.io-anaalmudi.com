document.addEventListener("DOMContentLoaded", (event) => {
    const IMAGE_WIDTH= 500;
    const DELAY= 3000;
    const $prev = document.querySelector('.prev');
    const $next= document.querySelector('.next');
    const $imageContainer= document.querySelector('.image-container');
    const $numimages= $imageContainer.childElementCount;
    let currentImg= 1;
    let timeout;
   
    function updateImg(){
        if (currentImg > $numimages-2){
            currentImg = 1;
        }
   
        $imageContainer.style.transform = `translateX(-${(currentImg - 1) * IMAGE_WIDTH}px)`;
   
        timeout = setTimeout(
            () => {
                currentImg++;
                updateImg();
   
            },
            DELAY,
        );
    }
   
    $prev.addEventListener(
        'click',
        () => {
            clearTimeout (timeout);
            currentImg--;
            updateImg();
   
        },
    );
    $next.addEventListener(
        'click',
        () => {
            clearTimeout(timeout);
            currentImg++;
            updateImg();
        },
       
    );
   
    updateImg();
    });