**Bootstrap Modal for iOS** stops page scrolling while a modal is displayed and adjusts the overlay position according to iOS Safari toolbars. Also, scrolling is now smooth.

[Thijs Huijssoon](https://gist.github.com/thuijssoon) created the **disableBodyScroll** function which stops page scrolling except the modal. I added the **adjustModal** function, which makes sure the overlay is positioned over the actual viewport. It also reacts to toolbars appearing.

Demo: [https://radogado.github.io/bootstrap-modal-ios/](https://radogado.github.io/bootstrap-modal-ios/)

Before:

![](https://radogado.github.io/bootstrap-modal-ios/video/Bootstrap%20Modal%20for%20iOS%20–%C2%A0Before%20–%C2%A0Portrait.gif)

![](https://radogado.github.io/bootstrap-modal-ios/video/Bootstrap%20Modal%20for%20iOS%20–%C2%A0Before%20–%C2%A0Landscape.gif) 

After:

![](https://radogado.github.io/bootstrap-modal-ios//video/Bootstrap%20Modal%20for%20iOS%20–%C2%A0Portrait.gif)

![](https://radogado.github.io/bootstrap-modal-ios//video/Bootstrap%20Modal%20for%20iOS%20–%C2%A0Landscape.gif) 

npm install --save-dev bootstrap-modal-ios
