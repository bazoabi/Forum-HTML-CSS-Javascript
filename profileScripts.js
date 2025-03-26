setupUI();

const user = JSON.parse(localStorage.getItem('user'));

const urlParams = new URLSearchParams(window.location.search);
const userIdQueryParam = urlParams.get('userId');

console.log("userIdQueryParam is: " + userIdQueryParam);

const validUserId = userIdQueryParam ?? user.id;

getPostsWithUserId(validUserId);

getUserInfo(validUserId);






function getUserInfo(userId) {

    toggleLoader(true);
    axios.get(`${baseUrl}/users/${userId}`)
    .then((response) => {
        const user = response.data.data;
        document.getElementById("main-info-profile-pic").src = user.profile_image;
        document.getElementById("main-info-email").innerHTML = user.email;
        document.getElementById("main-info-username").innerHTML = user.username;
        document.getElementById("main-info-name").innerHTML = user.name;
        document.getElementById("posts-count").innerHTML = user.posts_count;
        document.getElementById("comments-count").innerHTML = user.comments_count;

        document.getElementById("profile-post-creator-name").innerHTML = user.name;
    })
    .catch(function (error) {
        alert(error);
    })
    .finally(() => {
        toggleLoader(false);
    });
}


function getPostsWithUserId(userId) {

    console.log("userId is: " + userId);

    toggleLoader(true);
    axios.get(`${baseUrl}/users/${userId}/posts`)
    .then((response) => {
        console.log("the data is: " + response.data.data);
        const posts = response.data.data;
        document.getElementById("profile-posts").innerHTML = "";
        for(post of posts.reverse()) {

            const currUser = JSON.parse(localStorage.getItem('user'));
            const isMyPost = (currUser != null && (post.author.id == currUser.id)) ? "visible" : "hidden";

            let postTitle = "";
            if (post.title != null) {
                postTitle = post.title;
            }

            let tagsContent = "";
            for(tag of post.tags) {
                tagsContent += `
                <button class="tags rounded-pill px-3 py-1 border-0" style="display: inline; background-color: gray; color: white;">${tag}</button>
                `
            }
            
            // tags mimic
            tagsContent += `
                <button class="tags rounded-pill px-3 py-1 border-0" style="display: inline; background-color: gray; color: white;">Tag 1</button>
            `
            tagsContent += `
            <button class="tags rounded-pill px-3 py-1 border-0" style="display: inline; background-color: gray; color: white;">Tag 2</button>
            `
            // tags mimic

            let content = `
            <!-- Post -->
                    <div class="card shadow">
                        <div class="card-header">
                        <img class="rounded-circle border border-3 shadow" src="${post.author.profile_image}" alt="" style="width: 40px; height: 40px;">
                        <b>@${post.author.username}</b>
                        <button type="button" class="btn btn-secondary" style="float: right; visibility: ${isMyPost}" onclick="editPostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')">Edit</button>
                        <button type="button" class="btn btn-danger mx-1" style="float: right; visibility: ${isMyPost}" onclick="deletePostBtnClicked(${post.id})">Delete</button>
                        </div>
                        <div class="card-body" onclick="postClicked(${post.id})" style="cursor: pointer">
                            <img class="rounded border border-3 shadow" src="${post.image}" alt="" style="width: 100%;">
                            <h6 style="color: rgb(170, 170, 170);" class="mt-1">
                                ${post.created_at}
                            </h6>

                            <h5 class="mt-1">
                                ${postTitle}
                            </h5>

                            <p>
                                ${post.body}
                            </p>

                            <hr>

                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                                    <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                                </svg>
                                <span>
                                    (${post.comments_count}) Comments
                                </span>
                                ${tagsContent}
                            </div>
                        </div>
                    </div>
                    <!-- // Post // -->
            `
        document.getElementById("profile-posts").innerHTML += content;
        }
    })
    .catch(function (error) {
        alert(error);
    })
    .finally(() => {
        toggleLoader(false);
    });
}


// TODO: extract these dupped funcs from homeScripts.js


function editPostBtnClicked(postObject) {
    // alert(postId);
    const post = JSON.parse(decodeURIComponent(postObject));
    console.log(post);
    document.getElementById("post-id-input").value = post.id;
    document.getElementById("post-modal-title").innerHTML = "Edit Post";
    document.getElementById("post-title-input").value = post.title ?? "";
    document.getElementById("post-content-input").value = post.body;
    document.getElementById("post-image-input").src = post.image;
    document.getElementById("postModalSubmitBtn").innerHTML = "Update"
    let postModal = new bootstrap.Modal(document.getElementById("createPostModal"), {});
    postModal.toggle();
  }
  
  function deletePostBtnClicked(postId) {
      console.log("at the deletePostBtnClicked Function, the postId is: " + postId);
      document.getElementById("delete-post-id-label").innerHTML = postId;
      document.getElementById("delete-post-id-input").value = postId;
      let postModal = new bootstrap.Modal(document.getElementById("deletePostModal"), {});
      postModal.toggle();
  }
  
  function deletePostConfirmationClicked() {
      const token = localStorage.getItem("token");
      const headers = {
          "authorization": `Bearer ${token}`
      };
  
      const postId = document.getElementById("delete-post-id-input").value;
  
      url = `${baseUrl}/posts/${postId}`;
  
      toggleLoader(true);
      axios.delete(url, {
          "headers": headers
      })
      .then((response) => {
  
          console.log("response is: ", response);
          console.log("response stringify is: ", JSON.stringify(response));
          showAlert(`You have successfully deleted the post with ID ${postId}`, 'success');
          getPostsWithUserId(validUserId);
          getUserInfo(validUserId);
          const deletePostModal = document.getElementById("deletePostModal");
          const deletePostModalInstance = bootstrap.Modal.getInstance(deletePostModal)
          deletePostModalInstance.hide();
      })
      .catch(error => {
          console.log(error);
          const errMsg = error.response.data.message ?? error.response.data.error_message;
          showAlert(errMsg, 'danger');
      })
      .finally(() => {
        toggleLoader(false);
    });
  }
  
  
  function postClicked(postId) {
      window.location.replace(`./postDetails.html?postId=${postId}`);
  }


  function createPostClicked() {
    let postId = document.getElementById("post-id-input").value;
    const isCreate = (postId == null || postId == "");

    const title = document.getElementById("post-title-input").value;
    const content = document.getElementById("post-content-input").value;
    const image = document.getElementById("post-image-input").files[0]

    console.log("title is " + title + " content is " + content);

    let formData = new FormData();
    formData.append("title", title);
    formData.append("body", content);
    formData.append("image", image);

    // const params = {
    //     "title": title,
    //     "body": content
    // };

    const token = localStorage.getItem("token");
    const headers = {
        "Content-Type": "multipart/form-data",
        "authorization": `Bearer ${token}`
    };
    
    let url = ``;
    if (isCreate) {
        url = `${baseUrl}/posts`;

        toggleLoader(true);
        axios.post(url, formData, 
            {
                "headers": headers
            })
            .then((response) => {
        
                console.log("response is: ", response);
                console.log("response stringify is: ", JSON.stringify(response));
                const createPostModal = document.getElementById("createPostModal");
                const createPostModalInstance = bootstrap.Modal.getInstance(createPostModal)
                createPostModalInstance.hide();
                showAlert('You have successfully created a new post!', 'success');
                getPostsWithUserId(validUserId);
                getUserInfo(validUserId);
            })
            .catch(error => {
                console.log(error);
                const errMsg = error.response.data.message ?? error.response.data.error_message;
                showAlert(errMsg, 'danger');
            })
            .finally(() => {
                toggleLoader(false);
            });


    } else {
        formData.append("_method", "put");
        url = `${baseUrl}/posts/${postId}`;

        toggleLoader(true);
        axios.post(url, formData, 
            {
                "headers": headers
            })
            .then((response) => {
        
                console.log("response is: ", response);
                console.log("response stringify is: ", JSON.stringify(response));
                const createPostModal = document.getElementById("createPostModal");
                const createPostModalInstance = bootstrap.Modal.getInstance(createPostModal)
                createPostModalInstance.hide();
                showAlert('You have successfully edited the post!', 'success');
                getPostsWithUserId(validUserId);
                getUserInfo(validUserId);
            })
            .catch(error => {
                console.log(error);
                const errMsg = error.response.data.message ?? error.response.data.error_message;
                showAlert(errMsg, 'danger');
            })
            .finally(() => {
                toggleLoader(false);
            });
    }

    
    
}


function toggleLoader(show = true) {
    const loaderElm = document.getElementById("loader");
    if (show) {
        loaderElm.style.visibility = 'visible';
    }
    else {
        loaderElm.style.visibility = 'hidden';
    }
        
}


  // TODO: extract these dupped funcs from homeScripts.js