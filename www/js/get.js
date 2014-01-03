var first = 0 ;
var last = 0 ;

function feed_init(){
    
    $.getJSON(SERVER_URL+'public_lib/get_last_20', function(data){
        no_of_notif = data.length;
        console.log
        $('#notif_display').html('');
        for(i=0; i < no_of_notif ; i++){
            $('#notif_display').append('<li><a class="" id="notif" href="#post" data-transition="slide" onclick="get_post('+data[i].post_id+')"><h1>'+ data[i].post_title +'</h1><p>'+moment(data[i].post_date, "DD-MM-YYYY").format("Do MMM YYYY")+'</p></a></li>');
        }
        first = data[0].post_id ;
        last = data[no_of_notif - 1].post_id;
        $('#notif_display').append('<li id="loadMore" data-theme="a" data-inset="true"><a onclick="load_more('+first+')"><h1>Load more</h1></a></li>');
        $('#notif_display').listview('refresh');
       console.log("first = "+first+" , last = "+last);
       console.log(data);
    });
}

function load_more(){

    $.getJSON(SERVER_URL+'public_lib/get_next_10/'+last, function(data){
    
        $('#loadMore').remove();
        $('#notif_display').listview('refresh');
        no_of_notif = data.length ;
        console.log(data);
        for(i = 0 ; i < no_of_notif ; i++ ){
            $('#notif_display').append('<li data-theme="'+current_theme+'"><a class="" id="notif" href="#post" data-transition="slide" onclick="get_post('+data[i].post_id+')"><h4>'+ data[i].post_title +'</h4><p>'+moment(data[i].post_date, "DD-MM-YYYY").format("Do MMM YYYY")+'</p></a></li>');
        }
        last = data[no_of_notif - 1].post_id;
        console.log("first = "+first+" , last = "+last);
        if(last == 2 ){
            $('#notif_display').append('<li data-theme="b"><h1>No more posts.. </h1></li>');
        }else{
            $('#notif_display').append('<li id="loadMore" data-theme="'+current_theme+'" data-inset="true"><a href="#index" onclick="load_more()"><h1>Load more</h1></a></li>');
        }
        $('#notif_display').listview('refresh');

    });
    
}

function new_feed(){
    $.getJSON(SERVER_URL+'public_lib/refresh/'+first, function(data){
        no_of_notif = data.length ;
        if(data.length == 0 ){
            alert("No new feeds");
        }else{
            for(i=0; i < no_of_notif ; i++){
                $('#notif_display').prepend('<li data-theme="'+current_theme+'"><a class="" id="notif" href="#post" data-transition="slide" onclick="get_post('+data[i].post_id+')"><h4>'+ data[i].post_title +'</h4><p>'+moment(data[i].post_date, "DD-MM-YYYY").format("Do MMM YYYY")+'</p></a></li>');
            }
            first = data[0].post_id ;
            $('#notif_display').listview('refresh');
        }
              
    });
}

function get_post(post_id){
    $(".post_headline").html("Loading...");
    $(".post_date").html("FAST | Loading...");
    $(".post_content").html("Loading...");
    $(".post_feat_img").attr("src", "");    
    
    $.getJSON(SERVER_URL+'public_lib/get_post/'+post_id, function(data){
        var post_date = data[0].post_date;
        $(".post_headline").html(data[0].post_title);
        $(".post_date").html("FAST | "+moment(data[0].post_date, "DD-MM-YYYY").format("Do MMM YYYY"));
        $(".post_content").html(data[0].post_place+": "+ data[0].post_content);
        if(data[0].post_img == "no_image" || data[0].post_img == 'default.jpg'){
            $(".post_feat_img").attr("src", 'img/default.png');
        }else{
            $(".post_feat_img").attr("src", SERVER_URL+'img/thumbs/'+data[0].post_img);    
        }
        console.log(data);
    }).error(function(){
        $(".post_headline").html("");
        $(".post_date").html("");
        $(".post_content").html("Something went wrong. Please try again later.");
    });
}