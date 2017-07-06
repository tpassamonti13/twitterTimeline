var currentUserFullName;				// The current users full name whos timeline is loaded
var currentUserName;					// The current users user name whos timeline is loaded

$(document).ready(function()
{
	var characterCount = 140;			// Default max number of characters for a single tweet
	var mobileMenuOpened = false;		// Boolean to determine if mobile menu is displayed
	/*
	 * Retrieves JSON file with user profiles from server
	 */
	var json = (function () 
	{
	    var json = null;

	    $.ajax(
	    {
	        url: 'https://api.myjson.com/bins/umfrr',
	        dataType: "json",
	        type: 'GET',
	        success: function(data)
	        {
	        	$('#tweetStatistic').html(data.users[0].tweets);
	        	$('#followingStatistic').html(data.users[0].following);
	        	$('#followersStatistic').html(data.users[0].followers);
	        	$('#userProfilePicture').css('background-image', 'url(' + data.users[0].userProfilePicture + ')');
	        	$('#userPicture').css('background-image', 'url(' + data.users[0].userCoverPicture + ')');
	        	$('#userPane1').css('background-image', 'url(' + data.users[0].userProfilePicture + ')');
	        	$('#userPane2').css('background-image', 'url(' + data.users[1].userProfilePicture + ')');

	        	var count = 1;

	        	for (var i = 0; i < data.users[0].usersTweets.length; i++)
	        	{
	        		$('#tweets').prepend('<div class="tweetPane" id="tweetNumber' + count + '"><div class="tweetPaneLeft"><div class="tweetPaneProfilePicture" id="profilePicture' + data.users[0].userName + '"></div></div><div class="tweetPaneRight"><span class="userFullName" id="userFullName' + count + '"></span>&nbsp;<a href="#"><span class="userName" id="userName' + count + '"></span></a><span class="timeStamp" id="userName' + data.users[0].usersTweets[i].tweetTime + '"></span><br><span class="tweetText" id="tweetText' + count + '"></span></div><div class="tweetPaneIcons"><i class="fa fa-reply tweetIcons" aria-hidden="true"></i>&nbsp;&nbsp;<i class="fa fa-retweet tweetIcons" aria-hidden="true"></i>&nbsp;&nbsp;<i class="fa fa-star tweetIcons" aria-hidden="true"></i>&nbsp;&nbsp;<i class="fa fa-ellipsis-h tweetIcons" aria-hidden="true"></i></div></div>');

	        		var timeSince = $.now() - data.users[0].usersTweets[i].tweetTime;
	        		var timeStamp;

		        	if (timeSince < 60000)
		        	{
		        		timeStamp = 1;
		        		timePeriod = 'm';
		        	}
		        	else
		        	{
		        		timeStamp = Math.floor(timeSince / 60000);
		        		timePeriod = 'm';

		        		if (timeStamp >= 60 && timeStamp < 119)
					    {
					        timeStamp = 1
					        timePeriod = 'h';
					    }
					    if (timeStamp >= 120 && timeStamp < 179)
					    {
					        timeStamp = 2
					        timePeriod = 'h';
					    }
					    if (timeStamp >= 180 && timeStamp < 239)
					    {
					        timeStamp = 3
					        timePeriod = 'h';
					    }
					    if (timeStamp >= 240 && timeStamp < 299)
					    {
					        timeStamp = 4
					        timePeriod = 'h';
					    }
					    if (timeStamp > 300)
					    {
					        timeStamp = 5
					        timePeriod = 'h';
					    }
		        	}

	        		$('#userFullName' + count).html(data.users[0].usersTweets[i].fullName);
	        		$('#userName' + count).html('@' + data.users[0].usersTweets[i].userName);
	        		$('#tweetText' + count).html(data.users[0].usersTweets[i].tweetText);

	        		$('#userName' + data.users[0].usersTweets[i].tweetTime).html(timeStamp + timePeriod);
	        		$('#profilePicture' +  data.users[0].userName).css('background-image', 'url(' + data.users[0].userProfilePicture + ')');
	        		$('#tweetNumber1').css('border-bottom-width', '0');

	        		count++;
	        	}

	        	currentUserFullName = data.users[0].fullName;
	        	currentUserName = data.users[0].userName;
	        }
	    });

    	return json;
	})();

	$("#characterCounter").html(characterCount);

	/*
	 * Detects character count in compose new tweet text box and subtracts the character counter by 1 after a value is typed
	 */
	$('#composeNewTweet').keyup(function()
	{
	    characterCount = 140 + (- $(this).val().length);

		$("#characterCounter").html(characterCount);

     	if ($('#composeNewTweet').val() == '')
     	{
     		$('#userProfile').css('height', '250px');
     		$('#trends').css('top', '290px');
     		$('#copyrightPane').css('top', '580px');
     	}
     	else
     	{
     		$('#userProfile').css('height', '300px');
     		$('#trends').css('top', '340px');
     		$('#copyrightPane').css('top', '630px');
     	}    
	});

	/*
	 * Detects character count in compose new tweet text box and subtracts the character counter by 1 if the user holds a key down
	 */
	$('#composeNewTweet').keydown(function()
	{
		characterCount = 140 + (- $(this).val().length);

		$("#characterCounter").html(characterCount);
	});

	/*
	 * Brings up the switch user modal box
	 */
	$('#switchUsers').click(function()
	{
		$('#overlay').fadeIn(200);
	});
	$('#switchUsersMobile').click(function()
	{
		$('#overlay').fadeIn(200);
		$('#mobileMenu').css('height', '0px');
		mobileMenuOpened = false;
	});

	/*
	 * Closes the switch user modal box
	 */
	$('#closeButton').click(function()
	{
		$('#overlay').fadeOut(200);
	});

	$('#mobileHamburger').click(function()
	{
		if (mobileMenuOpened == false)
		{
			$('#mobileMenu').css('height', '240px');
			mobileMenuOpened = true;
		}
		else
		{
			$('#mobileMenu').css('height', '0px');
			mobileMenuOpened = false;
		}
	});

	/*
	 * Composes a new tweet after a user has submitted a tweet through the compose new tweet form
	 */
	$('#tweetForm').submit(function(e)
	{
		if ($('#composeNewTweet').val() != '')
		{
			composeNewTweet();
		}
		e.preventDefault();
	});

	/*
	 * Loads the first users Twitter account
	 */
	$('#userPane1').click(function()
	{
		$('#composeNewTweet').val('');
		$('#userProfile').css('height', '250px');
     	$('#trends').css('top', '290px');
     	$('#copyrightPane').css('top', '580px');
     	
		var json = (function () 
		{
		    var json = null;

		    $.ajax(
		    {
		        url: 'https://api.myjson.com/bins/umfrr',
		        dataType: 'json',
		        type: 'GET',
		        success: function(data)
		        {
		        	$('#tweetStatistic').html(data.users[0].tweets);
		        	$('#followingStatistic').html(data.users[0].following);
		        	$('#followersStatistic').html(data.users[0].followers);
		        	$('#userProfilePicture').css('background-image', 'url(' + data.users[0].userProfilePicture + ')');
		        	$('#userPicture').css('background-image', 'url(' + data.users[0].userCoverPicture + ')');
		        	$('#overlay').fadeOut(200);
		        	$('#tweets').empty();

		        	var count = 1;
	        	
		        	for (var i = 0; i < data.users[0].usersTweets.length; i++)
		        	{
		        		$('#tweets').prepend('<div class="tweetPane" id="tweetNumber' + count + '"><div class="tweetPaneLeft"><div class="tweetPaneProfilePicture" id="profilePicture' + data.users[0].userName + '"></div></div><div class="tweetPaneRight"><span class="userFullName" id="userFullName' + count + '"></span>&nbsp;<a href="#"><span class="userName" id="userName' + count + '"></span></a><span class="timeStamp" id="userName' + data.users[0].usersTweets[i].tweetTime + '"></span><br><span class="tweetText" id="tweetText' + count + '"></span></div><div class="tweetPaneIcons"><i class="fa fa-reply tweetIcons" aria-hidden="true"></i>&nbsp;&nbsp;<i class="fa fa-retweet tweetIcons" aria-hidden="true"></i>&nbsp;&nbsp;<i class="fa fa-star tweetIcons" aria-hidden="true"></i>&nbsp;&nbsp;<i class="fa fa-ellipsis-h tweetIcons" aria-hidden="true"></i></div></div>');

		        		var timeSince = $.now() - data.users[0].usersTweets[i].tweetTime;
		        		var timeStamp;

		        		if (timeSince < 60000)
		        		{
		        			timeStamp = 1;
		        			timePeriod = 'm';
		        		}
		        		else
			        	{
			        		timeStamp = Math.floor(timeSince / 60000);
			        		timePeriod = 'm';

			        		if (timeStamp >= 60 && timeStamp < 119)
					        {
					        	timeStamp = 1
					        	timePeriod = 'h';
					        }
					        if (timeStamp >= 120 && timeStamp < 179)
					        {
					        	timeStamp = 2
					        	timePeriod = 'h';
					        }
					        if (timeStamp >= 180 && timeStamp < 239)
					        {
					        	timeStamp = 3
					        	timePeriod = 'h';
					        }
					        if (timeStamp >= 240 && timeStamp < 299)
					        {
					        	timeStamp = 4
					        	timePeriod = 'h';
					        }
					        if (timeStamp > 300)
					        {
					        	timeStamp = 5
					        	timePeriod = 'h';
					        }
			        	}

		        		$('#userFullName' + count).html(data.users[0].usersTweets[i].fullName);
		        		$('#userName' + count).html('@' + data.users[0].usersTweets[i].userName);
		        		$('#tweetText' + count).html(data.users[0].usersTweets[i].tweetText);
		        		$('#userName' + data.users[0].usersTweets[i].tweetTime).html(timeStamp + timePeriod);
		        		$('#profilePicture' +  data.users[0].userName).css('background-image', 'url(' + data.users[0].userProfilePicture + ')');
		        		$('#tweetNumber1').css('border-bottom-width', '0');

		        		count++;
		        	}

		        	currentUserFullName = data.users[0].fullName;
	        		currentUserName = data.users[0].userName;
		        }
		    });

	    	return json;
		})();
	});

	/*
	 * Loads the second users Twitter account
	 */
	$('#userPane2').click(function()
	{
		$('#composeNewTweet').val('');
		$('#userProfile').css('height', '250px');
     	$('#trends').css('top', '290px');
     	$('#copyrightPane').css('top', '580px');

		var json = (function() 
		{
		    var json = null;

		    $.ajax(
		    {
		        url: 'https://api.myjson.com/bins/umfrr',
		        dataType: 'json',
		        type: 'GET',
		        success: function(data)
		        {
		        	$('#tweetStatistic').html(data.users[1].tweets);
		        	$('#followingStatistic').html(data.users[1].following);
		        	$('#followersStatistic').html(data.users[1].followers);
		        	$('#userProfilePicture').css('background-image', 'url(' + data.users[1].userProfilePicture + ')');
		        	$('#userPicture').css('background-image', 'url(' + data.users[1].userCoverPicture + ')');
		        	$('#overlay').fadeOut(200);
		        	$('#tweets').empty();

		        	var count = 1;
	        	
		        	for (var i = 0; i < data.users[1].usersTweets.length; i++)
		        	{
		        		$('#tweets').prepend('<div class="tweetPane" id="tweetNumber' + count + '"><div class="tweetPaneLeft"><div class="tweetPaneProfilePicture" id="profilePicture' + data.users[1].userName + '"></div></div><div class="tweetPaneRight"><span class="userFullName" id="userFullName' + count + '"></span>&nbsp;<a href="#"><span class="userName" id="userName' + count + '"></span></a><span class="timeStamp" id="userName' + data.users[1].usersTweets[i].tweetTime + '"></span><br><span class="tweetText" id="tweetText' + count + '"></span></div><div class="tweetPaneIcons"><i class="fa fa-reply tweetIcons" aria-hidden="true"></i>&nbsp;&nbsp;<i class="fa fa-retweet tweetIcons" aria-hidden="true"></i>&nbsp;&nbsp;<i class="fa fa-star tweetIcons" aria-hidden="true"></i>&nbsp;&nbsp;<i class="fa fa-ellipsis-h tweetIcons" aria-hidden="true"></i></div></div>');

		        		var timeSince = $.now() - data.users[1].usersTweets[i].tweetTime;
		        		var timeStamp;

		        		if (timeSince < 60000)
		        		{
		        			timeStamp = 1;
		        			timePeriod = 'm';
		        		}
		        		else
			        	{
			        		timeStamp = Math.floor(timeSince / 60000);
			        		timePeriod = 'm';

			        		if (timeStamp >= 60 && timeStamp < 119)
					        {
					        	timeStamp = 1
					        	timePeriod = 'h';
					        }
					        if (timeStamp >= 120 && timeStamp < 179)
					        {
					        	timeStamp = 2
					        	timePeriod = 'h';
					        }
					        if (timeStamp >= 180 && timeStamp < 239)
					        {
					        	timeStamp = 3
					        	timePeriod = 'h';
					        }
					        if (timeStamp >= 240 && timeStamp < 299)
					        		{
					        	timeStamp = 4
					        	timePeriod = 'h';
					        }
					        if (timeStamp > 300)
					        {
					        	timeStamp = 5
					        	timePeriod = 'h';
					        }
			        	}

		        		$('#userFullName' + count).html(data.users[1].usersTweets[i].fullName);
		        		$('#userName' + count).html('@' + data.users[1].usersTweets[i].userName);
		        		$('#tweetText' + count).html(data.users[1].usersTweets[i].tweetText);
		        		$('#userName' + data.users[1].usersTweets[i].tweetTime).html(timeStamp + timePeriod);
		        		$('#profilePicture' +  data.users[1].userName).css('background-image', 'url(' + data.users[1].userProfilePicture + ')');
		        		$('#tweetNumber1').css('border-bottom-width', '0');

		        		count++;
		        	}

		        	currentUserFullName = data.users[1].fullName;
	        		currentUserName = data.users[1].userName;
		        }
		    });

	    	return json;
		})();
	});
});

/*
 * Composes a new tweet depending on which user account is loaded and adds the tweet to the top of the users timeline
 */
function composeNewTweet()
{
	$.getJSON('https://api.myjson.com/bins/umfrr', function(data)
	{
		var newTweet = {
			"fullName": currentUserFullName,
			"userName": currentUserName,
			"tweetText": $('#composeNewTweet').val(),
			"tweetTime": $.now()
		};

		if (currentUserName == 'KMoney')
		{
			var newTweetCounter = data.users[0].tweets + 1;

			data.users[0].usersTweets.push(newTweet);
			data.users[0].tweets = newTweetCounter;

			var newData = JSON.stringify(data);

			$.ajax(
			{
				type: 'PUT',
				data: newData,
				url: 'https://api.myjson.com/bins/umfrr',
				contentType: "application/json; charset=utf-8",
		    	dataType: "json",
		    	success: function()
		    	{
		    		$.ajax(
					{
					    url: 'https://api.myjson.com/bins/umfrr',
					    dataType: 'json',
					    type: 'GET',
					    success: function(data)
					    {
					        $('#tweetStatistic').html(data.users[0].tweets);
					        $('#followingStatistic').html(data.users[0].following);
					        $('#followersStatistic').html(data.users[0].followers);
					        $('#userProfilePicture').css('background-image', 'url(' + data.users[0].userProfilePicture + ')');
					        $('#userPicture').css('background-image', 'url(' + data.users[0].userCoverPicture + ')');
					        $('#overlay').fadeOut(200);
					        $('#tweets').empty();

					        var count = 1;
				        	
					        for (var i = 0; i < data.users[0].usersTweets.length; i++)
					        {
					        	$('#tweets').prepend('<div class="tweetPane" id="tweetNumber' + count + '"><div class="tweetPaneLeft"><div class="tweetPaneProfilePicture" id="profilePicture' + data.users[0].userName + '"></div></div><div class="tweetPaneRight"><span class="userFullName" id="userFullName' + count + '"></span>&nbsp;<a href="#"><span class="userName" id="userName' + count + '"></span></a><span class="timeStamp" id="userName' + data.users[0].usersTweets[i].tweetTime + '"></span><br><span class="tweetText" id="tweetText' + count + '"></span></div><div class="tweetPaneIcons"><i class="fa fa-reply tweetIcons" aria-hidden="true"></i>&nbsp;&nbsp;<i class="fa fa-retweet tweetIcons" aria-hidden="true"></i>&nbsp;&nbsp;<i class="fa fa-star tweetIcons" aria-hidden="true"></i>&nbsp;&nbsp;<i class="fa fa-ellipsis-h tweetIcons" aria-hidden="true"></i></div></div>');

					        	var timeSince = $.now() - data.users[0].usersTweets[i].tweetTime;
				        		var timeStamp;

				        		if (timeSince < 60000)
				        		{
				        			timeStamp = 1;
				        			timePeriod = 'm';
				        		}
				        		else
					        	{
					        		timeStamp = Math.floor(timeSince / 60000);
					        		timePeriod = 'm';

					        		if (timeStamp >= 60 && timeStamp < 119)
					        		{
					        			timeStamp = 1
					        			timePeriod = 'h';
					        		}
					        		if (timeStamp >= 120 && timeStamp < 179)
					        		{
					        			timeStamp = 2
					        			timePeriod = 'h';
					        		}
					        		if (timeStamp >= 180 && timeStamp < 239)
					        		{
					        			timeStamp = 3
					        			timePeriod = 'h';
					        		}
					        		if (timeStamp >= 240 && timeStamp < 299)
					        		{
					        			timeStamp = 4
					        			timePeriod = 'h';
					        		}
					        		if (timeStamp > 300)
					        		{
					        			timeStamp = 5
					        			timePeriod = 'h';
					        		}
					        	}

					        	$('#userFullName' + count).html(data.users[0].usersTweets[i].fullName);
					        	$('#userName' + count).html('@' + data.users[0].usersTweets[i].userName);
					        	$('#tweetText' + count).html(data.users[0].usersTweets[i].tweetText);
					        	$('#userName' + data.users[0].usersTweets[i].tweetTime).html(timeStamp + timePeriod);
					        	$('#profilePicture' +  data.users[0].userName).css('background-image', 'url(' + data.users[0].userProfilePicture + ')');
					        	$('#tweetNumber1').css('border-bottom-width', '0');

					        	count++;
					        }

					        count = count - 1;

					        var height = $('#tweetNumber' + count).height();

					        $('#tweetNumber' + count).css('height', '0px');
					        $('#tweetNumber' + count).css('min-height', '0px');
					        $('#tweetNumber' + count).animate(
					        {
					        	height: height
					        }, 600);

					        $('#composeNewTweet').val('');
					        $('#userProfile').css('height', '250px');
					     	$('#trends').css('top', '290px');
					     	$('#copyrightPane').css('top', '580px');
					    }
					});
		    	}
			});
		}

		if (currentUserName == 'lordyvader')
		{
			var newTweetCounter = data.users[1].tweets + 1;

			data.users[1].usersTweets.push(newTweet);
			data.users[1].tweets = newTweetCounter;

			var newData = JSON.stringify(data);

			$.ajax(
			{
				type: 'PUT',
				data: newData,
				url: 'https://api.myjson.com/bins/umfrr',
				contentType: "application/json; charset=utf-8",
			    dataType: "json",
			    success: function()
			    {
			    	$.ajax(
					{
						url: 'https://api.myjson.com/bins/umfrr',
						dataType: 'json',
						type: 'GET',
						success: function(data)
						{
						    $('#tweetStatistic').html(data.users[1].tweets);
						    $('#followingStatistic').html(data.users[1].following);
						    $('#followersStatistic').html(data.users[1].followers);
						    $('#userProfilePicture').css('background-image', 'url(' + data.users[1].userProfilePicture + ')');
						    $('#userPicture').css('background-image', 'url(' + data.users[1].userCoverPicture + ')');
						    $('#overlay').fadeOut(200);
						    $('#tweets').empty();

						    var count = 1;
					        	
						    for (var i = 0; i < data.users[1].usersTweets.length; i++)
						    {
						        $('#tweets').prepend('<div class="tweetPane" id="tweetNumber' + count + '"><div class="tweetPaneLeft"><div class="tweetPaneProfilePicture" id="profilePicture' + data.users[1].userName + '"></div></div><div class="tweetPaneRight"><span class="userFullName" id="userFullName' + count + '"></span>&nbsp;<a href="#"><span class="userName" id="userName' + count + '"></span></a><span class="timeStamp" id="userName' + data.users[1].usersTweets[i].tweetTime + '"></span><br><span class="tweetText" id="tweetText' + count + '"></span></div><div class="tweetPaneIcons"><i class="fa fa-reply tweetIcons" aria-hidden="true"></i>&nbsp;&nbsp;<i class="fa fa-retweet tweetIcons" aria-hidden="true"></i>&nbsp;&nbsp;<i class="fa fa-star tweetIcons" aria-hidden="true"></i>&nbsp;&nbsp;<i class="fa fa-ellipsis-h tweetIcons" aria-hidden="true"></i></div></div>');

						        var timeSince = $.now() - data.users[1].usersTweets[i].tweetTime;
				        		var timeStamp;
				        		var timePeriod;

				        		if (timeSince < 60000)
				        		{
				        			timeStamp = 1;
				        			timePeriod = 'm';
				        		}
				        		else
					        	{
					        		timeStamp = Math.floor(timeSince / 60000);
					        		timePeriod = 'm';

					        		if (timeStamp >= 60 && timeStamp < 119)
					        		{
					        			timeStamp = 1
					        			timePeriod = 'h';
					        		}
					        		if (timeStamp >= 120 && timeStamp < 179)
					        		{
					        			timeStamp = 2
					        			timePeriod = 'h';
					        		}
					        		if (timeStamp >= 180 && timeStamp < 239)
					        		{
					        			timeStamp = 3
					        			timePeriod = 'h';
					        		}
					        		if (timeStamp >= 240 && timeStamp < 299)
					        		{
					        			timeStamp = 4
					        			timePeriod = 'h';
					        		}
					        		if (timeStamp > 300)
					        		{
					        			timeStamp = 5
					        			timePeriod = 'h';
					        		}
					        	}

					        	$('#userFullName' + count).html(data.users[1].usersTweets[i].fullName);
					        	$('#userName' + count).html('@' + data.users[1].usersTweets[i].userName);
					        	$('#tweetText' + count).html(data.users[1].usersTweets[i].tweetText);
					        	$('#userName' + data.users[1].usersTweets[i].tweetTime).html(timeStamp + timePeriod);
						        $('#profilePicture' +  data.users[1].userName).css('background-image', 'url(' + data.users[1].userProfilePicture + ')');
						        $('#tweetNumber1').css('border-bottom-width', '0');

						        count++;
						    }

						    count = count - 1;

					        var height = $('#tweetNumber' + count).height();

					        $('#tweetNumber' + count).css('height', '0px');
					        $('#tweetNumber' + count).css('min-height', '0px');
					        $('#tweetNumber' + count).animate(
					        {
					        	height: height
					        }, 600);

					        $('#composeNewTweet').val('');
					        $('#userProfile').css('height', '250px');
					     	$('#trends').css('top', '290px');
					     	$('#copyrightPane').css('top', '580px');
						}
					});
			    }
			});
		}
	});
}