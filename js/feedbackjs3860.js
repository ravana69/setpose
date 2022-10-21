var $grid;
var commentreplyopen = false;

$(".designFormContainer").on("submit", "form", function() {
    $(this).find("input[type='submit']").attr('disabled', 'disabled').val('Posting...');
    $(this).submit(function() {
        return false;
    });
    return true;
});

$(function() {
    // if($('.inlineposts .postlist').length > 0){
    //     if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    //         var gutterspace = 5;
    //     } else {
    //         var gutterspace = 20;
    //     }
    //     $grid = $('.inlineposts .postlist').masonry({
    //         itemSelector: '.design-post',
    //         gutter: gutterspace
    //     });
    // }
    $('.lazy').Lazy({
        afterLoad: function(element) {
            element.parent().removeClass('loading');
        }
    });
});

function commentMarkers(loaded) {
    $(".markerImg").each(function() {
        if(loaded == 0) {
            $(".markerImg").on('load', function(){
                var markerx = $(this).attr("data-markerx");
                var markery = $(this).attr("data-markery");

                var imgWidth = $(this).width();
                var imgHeight = $(this).height();

                var markerImgLeft = "calc(-" + markerx / 100 + " * " + imgWidth + "px + 60px)";
                var markerImgTop = "calc(-" + markery / 100 + " * " + imgHeight + "px + 50px)";

                $(this).css("left", markerImgLeft);
                $(this).css("top", markerImgTop);

                $(this).parent().on('mouseover', function(){
                    if($(this).parent().parent().parent().find(".img-wrap").find(".markerShow").length == 0){
                        $(this).parent().parent().parent().find(".img-wrap").prepend('<span class="markerShow" style="display: inline; top: '+markery+'%; left: '+markerx+'%;"></span>');
                    }
                });
                $(this).parent().on('mouseout', function(){
                    $(this).parent().parent().parent().find(".img-wrap").find(".markerShow").remove();
                });
            });
        } else {
            var markerx = $(this).attr("data-markerx");
            var markery = $(this).attr("data-markery");

            var imgWidth = $(this).width();
            var imgHeight = $(this).height();

            var markerImgLeft = "calc(-" + markerx / 100 + " * " + imgWidth + "px + 60px)";
            var markerImgTop = "calc(-" + markery / 100 + " * " + imgHeight + "px + 50px)";

            $(this).css("left", markerImgLeft);
            $(this).css("top", markerImgTop);

            $(this).parent().on('mouseover', function(){
                if($(this).parent().parent().parent().find(".img-wrap").find(".markerShow").length == 0){
                    $(this).parent().parent().parent().find(".img-wrap").prepend('<span class="markerShow" style="display: inline; top: '+markery+'%; left: '+markerx+'%;"></span>');
                }
            });
            $(this).parent().on('mouseout', function(){
                $(this).parent().parent().parent().find(".img-wrap").find(".markerShow").remove();
            });
        }

    });
}

function postMarkers() {
    $(".design-post .img-wrap, .afterpost-inner .img-wrap").each(function() {
        $(this).click(function(e) {
            var posX = $(this).find("img").offset().left, posY = $(this).offset().top;
            var height = $(this).find("img").height(), width = $(this).find("img").width();
            var posXpixelVal = e.pageX - posX, posYpixelVal = e.pageY - posY;
            if($(this).parent().hasClass("afterpost-inner")) {
                $(this).parent().parent().find(".x").attr("value", (Number(posXpixelVal / width * 100).toFixed(0)));
                $(this).parent().parent().find(".y").attr("value", (Number(posYpixelVal / height * 100).toFixed(0)));
            } else {
                $(this).parent().find(".x").attr("value", (Number(posXpixelVal / width * 100).toFixed(0)));
                $(this).parent().find(".y").attr("value", (Number(posYpixelVal / height * 100).toFixed(0)));
            }

            $(this).find(".marker").fadeIn("fast");
            $(this).find(".marker").css("top", posYpixelVal / height * 100 + "%");
            $(this).find(".marker").css("left", posXpixelVal / width * 100 + "%");
        })
    });
}

function signInClose() {
    $(".SignUpInForm").fadeOut("fast");
    $(".popUpBack").fadeOut("fast");
}

function upgradePopupClose() {
    $(".popupupgradecont").fadeOut("fast");
    $(".popUpBack").fadeOut("fast");
}

function signInOpen() {
    $(".SignUpInForm").fadeIn("fast");
    $(".popUpBack").fadeIn("fast");
}

function upgradePopupOpen() {
    $(".inlineupgradepopup").load("scripts/inlineupgrade");
    $(".popupupgradecont").fadeIn();
    $(".popUpBack").fadeIn();
}

function feedbackAfterClose() {
    $(".afterpost").fadeOut("fast");
    $(".popUpBack").fadeOut("fast");
    window.history.replaceState(null, null, window.location.pathname);
}

function signUp() {
    $("#signupbutton").on('click', function() {
        var signupname = $("#signupname").val();
        var signupemail = $("#signupemail").val();
        var signuppassword = $("#signuppassword").val();
        if(signupname != "" && signupemail != "" && signuppassword != ""){
            if(signuppassword.length > 8){
                $.ajax({
                    url: 'https://setpose.com/scripts/signup.php',
                    type: 'POST',
                    data: {
                        fullname: signupname,
                        email: signupemail,
                        password: signuppassword
                    },
                    success: function(msg) {
                        showNotification("Signed up, you can now sign in");
                    },
                    error: function(xhr, ajaxOptions, thrownError) {
                        showNotification(JSON.parse(xhr.responseText).errormessage);
                    }
                });
            } else {
                showNotification("Password must be 8 characters or longer");
            }
        } else {
            showNotification("Fill in all inputs");
        }
    })
}

function signIn() {
    $("#signinbutton").on('click', function() {
        var returnurl = [location.protocol, '//', location.host, location.pathname].join('');
        var signinemail = $("#signinemail").val();
        var signinpassword = $("#signinpassword").val();
        var signinremember = $("#rememberme").val();
        if(signinemail != "" && signinpassword != ""){
            $.ajax({
                url: 'https://setpose.com/scripts/signin.php',
                type: 'POST',
                data: {
                    email: signinemail,
                    password: signinpassword,
                    rememberme: signinremember
                },
                success: function(msg) {
                    showNotification("Signed in");
                    if (location.pathname == "/upgrade") {
                        location.reload();
                    } else {
                        window.location.replace(returnurl);
                    }
                },
                error: function(xhr, ajaxOptions, thrownError) {
                    showNotification(JSON.parse(xhr.responseText).errormessage);
                }
            });
        } else {
            showNotification("Fill in all inputs");
        }
    })
}

function pressedAddMarkerButton() {
    $(".addMarkerButton").each(function() {
        $(this).click(function(e) { showNotification("You can add a marker by clicking on the image"); });
    });
}

function showNotification(text, timing = 2000) {
    $(".notification").html(text);
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        var bottomspace = 20;
    } else {
        var bottomspace = 20;
    }
    $(".notification").animate({"bottom": bottomspace + "px"}, "fast");
    setTimeout(function(){
        $(".notification").animate({"bottom": "-100px"}, "fast");
    }, timing);
}

function pressedDeletePost() {
    $(".dropdownDeleteButton").each(function() {
        $(this).unbind('click').bind('click', function() {
            var designpostid = $(this).data("postid");
            $.ajax({
                url: 'https://setpose.com/scripts/delete.php',
                type: 'POST',
                data: {
                    type: "post",
                    postid: designpostid
                },
                success: function(msg) {
                    showNotification("Post deleted");
                    $(".design-post#" + designpostid).remove();
                },
                error: function(xhr, ajaxOptions, thrownError) {
                    showNotification(JSON.parse(xhr.responseText).errormessage);
                }
            });
        })
    });
}

function pressedDeleteComment() {
    $(".deleteCommentButton").each(function() {
        $(this).unbind('click').bind('click', function() {
            var commentid = $(this).data("commentid");
            $.ajax({
                url: 'https://setpose.com/scripts/delete.php',
                type: 'POST',
                data: {
                    type: "comment",
                    commentid: commentid
                },
                success: function(msg) {
                    showNotification("Comment deleted");
                    $("#comment-" + commentid).remove();
                },
                error: function(xhr, ajaxOptions, thrownError) {
                    showNotification(JSON.parse(xhr.responseText).errormessage);
                }
            });
        })
    });
}

function pressedReplyComment() {
    $(".replyCommentButton").each(function() {
        $(this).unbind('click').bind('click', function() {
            var commentid = $(this).data("commentid");
            var postid = $(this).data("postid");
            var parentcomment = $(this).parent().parent().parent();
            var commentreplyform;
            if(!commentreplyopen) {
                $(".commentreplyform").each(function() {
                    commentreplyform = $(this);
                    commentreplyform.remove();
                });
                var parentcontainer = $(this).parent();
                parentcomment.append('<form class="commentreplyform" onsubmit="return false"><input type="hidden" class="postid" value="' + postid + '"><input type="hidden" class="replyid" value="' + commentid + '"><textarea class="commentFormInput" name="text" placeholder="Reply to this comment" required="" spellcheck="false" rows="1"></textarea><input type="submit" name="submit" value="Reply" class="right btn-primary sendreplycomment"></div><div class="floatWrap"></form>');
                commentreplyopen = true;
                $(parentcomment).find(".sendreplycomment").unbind('click').bind('click', function() {
                    var commentcontent = $(this).siblings(".commentFormInput").val();
                    if(commentcontent != "") {
                        $.ajax({
                            url: 'https://setpose.com/scripts/postcomment.php',
                            type: 'POST',
                            data: {
                                postid: postid,
                                replyid: commentid,
                                commentcontent: commentcontent
                            },
                            success: function(msg) {
                                $(".commentreplyform").remove();
                                commentreplyopen = false;
                                $(parentcomment).append('<div class="subcomment"><div class="postCommentInner">' + commentcontent + '</div><div class="postCommentDesc"><span class="postCommentDate"> Just now by <a href="https://setpose.com/profile?i=' + msg.userid + '">' + msg.username + '</a> - <span data-commentid="' + msg.commentid + '" data-postid="' + msg.postid + '" class="underline replyCommentButton">Reply</span> - <span data-commentid="' + msg.commentid + '" class="underline deleteCommentButton">Delete</span> </span></div></div>');
                                pressedDeleteComment();
                                pressedReplyComment();
                            },
                            error: function(xhr, ajaxOptions, thrownError) {
                                showNotification(JSON.parse(xhr.responseText).errormessage);
                            }
                        });
                    }
                })
            } else {
                $(".commentreplyform").each(function() { $(this).remove(); });
                commentreplyopen = false;
            }
        })
    });
}

function clickFeedbackSkip() {
    $(".skipfeedbackbutton").on('click', function(e) {
        loadFeedbackCommentPost($(".afterpost.givefeedback .commentform .sendcomment"));
    });
}

function loadFeedbackCommentPost(commentbutton) {
    $.ajax({
        url: 'https://setpose.com/scripts/givefeedbackpost.php',
        type: "get"
    }).done(function(data) {
        parentcontainer = $(commentbutton).parent().parent().parent();
        $(".afterpost").find(".feedbackdonecheck").addClass("playanimation");
        $(commentbutton).parent().parent().find(".afterpost-inner").animate({
            opacity: 0
        }, 1000, function() {
            $(parentcontainer).height($(parentcontainer).height());
            setTimeout(function(){
                $(".afterpost").find(".feedbackdonecheck").removeClass("playanimation");
                $(commentbutton).parent().parent().html(data);
                clickFeedbackSkip();
                pressedComment();
                $(commentbutton).parent().parent().find(".afterpost-inner").animate({
                    opacity: 1
                }, 1000, function() {
                });
            }, 500);
        });
    }).fail(function(jqXHR, ajaxOptions, thrownError) {});
}

function pressedComment() {
    $(".commentform .sendcomment").each(function() {
        $(this).unbind('click').bind('click', function() {
            var commentbutton = $(this);
            var commentform = $(this).siblings(".commentFormInput");
            var commentlistcontainer = $(this).parent().parent().find(".postCommentList");
            var commentcontent = $(commentform).val();
            var markerx = $(this).siblings(".markerx").val();
            var markery = $(this).siblings(".markery").val();
            var postid = $(this).siblings(".postid").val();
            if(commentcontent != "") {
                $.ajax({
                    url: 'https://setpose.com/scripts/postcomment.php',
                    type: 'POST',
                    data: {
                        postid: postid,
                        commentcontent: commentcontent,
                        markerx: markerx,
                        markery: markery
                    },
                    success: function(msg) {
                        if($(commentbutton).hasClass("givefeedbackform")) {
                            loadFeedbackCommentPost(commentbutton);
                        } else {
                            if(markerx != 0 || markery != 0) {
                                $(commentlistcontainer).prepend('<div class="postComment" id="comment-' + msg.commentid + '"><div class="postCommentInner postCommentInnerMarker">' + commentcontent + '</div><div class="markerImgContainer"><span class="commentMarker"></span><img src="uploads/' + msg.postimg + '" class="markerImg" data-markerx="' + markerx + '" data-markery="' + markery + '"></div><div class="postCommentDesc"><span class="postCommentDate">Just now by <a href="https://setpose.com/profile?i=' + msg.userid + '">' + msg.username + '</a> - <span data-commentid="' + msg.commentid + '" data-postid="' + msg.postid + '" class="underline replyCommentButton">Reply</span> - <span data-commentid="' + msg.commentid + '" class="underline deleteCommentButton">Delete</span></span></div><div class="floatWrap"></div></div>');
                                $(commentform).val("");
                                pressedDeleteComment();
                                pressedReplyComment();
                                commentMarkers(0);
                            } else {
                                $(commentlistcontainer).prepend('<div class="postComment" id="comment-' + msg.commentid + '"><div class="postCommentInner">' + commentcontent + '</div><div class="postCommentDesc"><span class="postCommentDate">Just now by <a href="https://setpose.com/profile?i=' + msg.userid + '">' + msg.username + '</a> - <span data-commentid="' + msg.commentid + '" data-postid="' + msg.postid + '" class="underline replyCommentButton">Reply</span> - <span data-commentid="' + msg.commentid + '" class="underline deleteCommentButton">Delete</span> </span></div><div class="floatWrap"></div></div>');
                                $(commentform).val("");
                                pressedDeleteComment();
                                pressedReplyComment();
                            }
                        }
                    },
                    error: function(xhr, ajaxOptions, thrownError) {
                        showNotification(JSON.parse(xhr.responseText).errormessage);
                    }
                });
            }
        })
    });
}

function pressedReportPost() {
    $(".dropdownReportButton").each(function() {
        $(this).unbind('click').bind('click', function() {
            var designpostid = $(this).data("postid");
            $.ajax({
                url: 'https://setpose.com/scripts/report.php',
                type: 'POST',
                data: {
                    type: "post",
                    post: designpostid
                },
                success: function(msg) {
                    showNotification("Post reported");
                },
                error: function(xhr, ajaxOptions, thrownError) {
                    showNotification(JSON.parse(xhr.responseText).errormessage);
                }
            });
        })
    });
}

function toggleDesignPostDropdown() {
    $(".designPostDropdown").each(function() {
        var designPostDropdownOpen = false;
        $(this).on('click', function(e) {
            if(designPostDropdownOpen == false){
                $(this).find(".dropdownMenu").fadeIn("fast");
                designPostDropdownOpen = true;
            } else {
                $(this).find(".dropdownMenu").fadeOut("fast");
                designPostDropdownOpen = false;
            }
        })
    });
}

function pressedLikeButton() {
    $(".likeButton").each(function() {
        $(this).unbind('click').bind('click', function() {
            var thisLikeButton = $(this);
            var designpostid = $(this).data("postid");
            $.ajax({
                url: 'https://setpose.com/scripts/addLike.php',
                type: 'POST',
                data: {
                    postid: designpostid
                },
                success: function(msg) {
                    //showNotification("Post liked");
                    var likeNumber = parseInt(thisLikeButton.find(".likeNumber").html());
                    if(likeNumber == "") {
                        thisLikeButton.find(".likeNumber").html("1");
                    } else {
                        thisLikeButton.find(".likeNumber").html(likeNumber + 1);
                    }
                    thisLikeButton.find(".likebuttonclick").addClass("clicked");
                    setTimeout(function(){
                        thisLikeButton.find(".likebuttonclick").removeClass("clicked");
                    }, 500);
                },
                error: function(xhr, ajaxOptions, thrownError) {
                    showNotification(JSON.parse(xhr.responseText).errormessage);
                }
            });
        })
    });
}

function allowSharingButton(){
    $('#sharingcheckbox').change(function() {
        if(this.checked) {
            $(".socialinputs").show();
        } else {
            $(".socialinputs").hide();
        }
    });
}

function addBriefButton(){
    $('#briefcheckbox').change(function() {
        if(this.checked) {
            $(".pastbriefs").show();
        } else {
            $(".pastbriefs").hide();
        }
    });
}

function openFullScreenImg() {
    $('.inlineposts .img-wrap img').each(function() {
        $(this).on('click',function(e){
            var clickedimg = $(this);
            $('.img-fullscreen img').attr('src', clickedimg.attr('src'));
            $('.img-fullscreen').fadeIn();
        });
    });

    $('.img-fullscreen .img-fullscreen-close').on('click',function(e){
        $('.img-fullscreen').fadeOut();
    }); 
}

function newPageLoaded() {
    commentMarkers(0);
    postMarkers();
    pressedDeletePost();
    pressedReportPost();
    pressedComment();
    pressedDeleteComment();
    pressedReplyComment();
    toggleDesignPostDropdown();
    pressedLikeButton();
    pressedAddMarkerButton();
    openFullScreenImg();

    $('.lazy').Lazy({
        afterLoad: function(element) {
            element.parent().removeClass('loading');
            //$grid.masonry();
        }
    });

    $grid.masonry();

    
}

$(window).on('load', function(){
    commentMarkers();
    postMarkers();
});

$(document).ready(function(e) {
    clickFeedbackSkip();
    pressedDeletePost();
    pressedComment();
    pressedDeleteComment();
    pressedReplyComment();
    pressedReportPost();
    toggleDesignPostDropdown();
    pressedLikeButton();
    pressedAddMarkerButton();
    allowSharingButton();
    addBriefButton();
    openFullScreenImg();
    signUp();
    signIn();


    $('#searchbriefs').on('input',function(e){
        var brieftitle = $("#searchbriefs")[0].value;
        $.ajax({
            url: 'scripts/feedbacksearchbriefs.php?title=' + brieftitle,
            type: "get",
            beforeSend: function() { 
                //$(".writtenbriefsgrid").fadeOut();
            }
        })
        .done(function(data) {
            $(".pastbriefcont").html(data);
        })
        .fail(function(jqXHR, ajaxOptions, thrownError) {
            //alert('server not responding...');
        });
    });

    $('.designFileInput').bind('change', function() {
        if(this.files[0].size > 2000000) {
            showNotification("ERROR: File too large, max file size: 2Mb");
            $("form p.fileName").text("ERROR: File too large, max file size: 2MB");
        } else {
            $("form p.fileName").text(this.files[0].name + " selected");
        }
    });

    var emailchangeopen = false;
    $("#emailchangebtn").click(function(e) {
        if(!emailchangeopen) {
            $(".emailchangeform").show();
            emailchangeopen = true;
        } else {
            $(".emailchangeform").hide();
            emailchangeopen = false;
        }
    });

    $("#gridselector").click(function(e) {
        document.cookie = "postslist=grid; max-age=31536000; path=/;";
        location.reload();
    });

    $("#listselector").click(function(e) {
        document.cookie = "postslist=list; max-age=31536000; path=/;";
        location.reload();
    });

    $(".signInModalButton").each(function(){$(this).click(function(e) { signInOpen(); })});
    $(".SignUpInFormClose").click(function(e) { signInClose(); });
    $(".popUpBack").click(function(e) { signInClose(); });

    $(".FeedbackAfterClose").click(function(e) { feedbackAfterClose(); });
    $(".popUpBack").click(function(e) { feedbackAfterClose(); });

    $(".UpgradePopupClose").on('click', function(e) { upgradePopupClose(); });
    $(".popUpBack").click(function(e) { upgradePopupClose(); });

    $(".viewmorebutton").click(function(e){
        $(".profileContainer.profileFeedbackBlock").css("max-height", "initial");
        $(".viewmorebutton").hide();
    });

});
