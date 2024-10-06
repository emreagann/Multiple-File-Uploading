const fileBrowseButton = document.querySelector(".file-browse-button");
const fileList = document.querySelector(".file-list");
const fileBrowseInput = document.querySelector(".file-browse-input");
const fileUploadBox = document.querySelector(".file-upload-box");
const fileCompletedStatus = document.querySelector(".file-completed-status");
let totalFiles = 0;
let completedFiles = 0;
const createFileItemHTML = (file,uniqueIdentifier) =>{
          const {name,size} = file;
          const extension = name.split(".").pop();
          return ` <li class="file-item id="file-item-${uniqueIdentifier}">
                                        <div class="file-extension">${extension}</div>
                                        <div class="file-content-wrapper">
                                                  <div class="file-content">
                                                            <div class="file-details">
                                                                      <h5 class="file-name">${name}</h5>
                                                                      <div class="file-info">
                                                                                <small class="file-size">${size}</small>
                                                                                <small class="file-divider">.</small>
                                                                                <small class="file-status">Uploading...</small>


                                                                      </div>
                                                            </div>
                                                            <button class="cancel-button">
                                                                      <i class="bx bx-x"></i>
                                                            </button>
                                                  </div>
                                                  <div class="file-progress-bar">
                                                            <div class="file-progress"></div>
                                                  </div>
                                        </div>
                              </li>`
}
const handleFileUploading = (file,uniqueIdentifier) => {
          const xhr = new XMLHttpRequest();
          const formData = new FormData();
          formData.append("file",file);
          xhr.open("POST","api.php",true);
          xhr.send(formData);
          return xhr;
          xhr.upload.addEventListener("progress",(e)=>{
const fileProgress = document.querySelector(`#file-item${uniqueIdentifier}.file-progress`);
const fileSize = document.querySelector(`#file-item${uniqueIdentifier}.file-size`);
const formattedFileSize =file.size >= 1024 * 1024 ? `${(e.loaded / (1024 * 1024)).toFixed(2)} MB / ${(e.total / (1024 * 1024)).toFixed(2)} MB` : `${(e.loaded / 1024).toFixed(2)} KB / ${(e.total / 1024).toFixed(2)} KB`;
const progress = Math.round((e.loaded / e.total)* 100);
fileProgress.style.width = `${progress}%`;
fileSize.innerText = `${e.loaded} / ${e.total}`;
          })
};

const handleSelectedFiles = ([...files]) =>{
          if(files.length === 0) return;
          totalFiles += files.length;
          files.forEach((file,index)=>{
                    const uniqueIdentifier = Date.now() + index;
const fileItemHTML = createFileItemHTML(file,uniqueIdentifier);
fileList.insertAdjacentHTML("afterbegin",fileItemHTML);
const currentFileItem = document.querySelector(`#file-item${uniqueIdentifier}`);
const cancelFileUploadButton = currentFileItem.querySelector(".cancel-button");
const xhr = handleFileUploading(file,uniqueIdentifier);
xhr.addEventListener("readystatechange",()=>{
          if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200){
                    completedFiles++;
currentFileItem.querySelector(".file-status").innerText="Completed";
currentFileItem.querySelector(".file-status").style="#00B125";
cancelFileUploadButton.remove();
file.fileCompletedStatus.innerText = `${completedFiles} / ${totalFiles} files completed`;
          }
});
cancelFileUploadButton.addEventListener("click",()=>{
          xhr.abort();
          currentFileItem.querySelector(".file-status").innerText="Canceled";
currentFileItem.querySelector(".file-status").style="#E3413F";
cancelFileUploadButton.remove();
});
xhr.addEventListener("error",()=>{
          alert("An error occurred during the file upload!");
});
          });
          fileCompletedStatus.innerText = `${completedFiles} / ${totalFiles} files completed`;
}
fileUploadBox.addEventListener("drop",(e)=>{
          e.preventDefault();
          handleSelectedFiles(e.dataTransfer.files);
          fileUploadBox.classList.remove("active");
          fileUploadBox.querySelector(".file-instruction").innerText = "Drag files here or";
})
fileUploadBox.addEventListener("dragover",(e)=>{
          e.preventDefault();
          fileUploadBox.querySelector("file-instruction").innerText = "Release to upload or";
          fileUploadBox.classList.add("active");
});
fileUploadBox.addEventListener("dragleave",(e)=>{
          e.preventDefault();
          fileUploadBox.classList.remove("active");
          fileUploadBox.querySelector(".file-instruction").innerText = "Drag files here or"
});
fileBrowseButton.addEventListener("click",() => fileBrowseInput.click());
fileBrowseInput.addEventListener("change",(e)=>handleSelectedFiles(e.target.files));
