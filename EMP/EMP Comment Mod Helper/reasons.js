console.log("reasons.js loaded...");

const modReasons = [
  {
    id: "category",
    title: "category complaint",
    text: "[mcom]Do not complain about categories in the torrent comments. If you believe something is wrong with a torrent, make use of the report function on top of the page.[/mcom]",
    staffPM:
      "Do not complain about categories in the torrent comments. If you believe something is wrong with a torrent, make use of the report function on top of the page.",
  },
  {
    id: "bickering",
    title: "content bickering",
    text: "[mcom]If you are not interested in the content, just move on.[/mcom]",
    staffPM:
      "Do not ruin an upload for someone else just because it's not your thing. Keep opinions and comments respectful to those that might enjoy the content. If you are not interested in the content, just move on.",
  },
  {
    id: "tag",
    title: "tag discussion",
    text: "[mcom]Do not complain about tags in the torrent comments. If you believe a tag is wrong down vote the tag and report it to be removed here. https://www.empornium.is/forum/thread/77739[/mcom]",
    staffPM:
      "Do not complain about tags in the torrent comments. If you believe a tag is wrong down vote the tag and report it to be removed here. https://www.empornium.is/forum/thread/77739",
  },
  {
    id: "request",
    title: "request",
    text: "[mcom]Do not make requests in the comments. If you want certain content to be uploaded it needs to be done through an official request in the [url=https://www.empornium.is/requests.php]Requests[/url] section.[/mcom]",
    staffPM:
      "Please do not make requests in the comments. If you want certain content to be uploaded it needs to be done through an official request in the [url=https://www.empornium.is/requests.php]Requests[/url] section.",
  },
  {
    id: "userrequest",
    title: "request for specific user",
    text: "[mcom]:no2:[/mcom]",
    staffPM: "Creating a request for a specific user is not allowed.",
  },
  {
    id: "requestpromo",
    title: "request promotion",
    text: "[mcom]Please do not promote your request in the comments. You may use your signature or profile for that.[/mcom]",
    staffPM:
      "Please do not promote your request in the comments. You may use your signature or profile for that.",
  },
  {
    id: "torrentpromo",
    title: "torrent promotion",
    text: "[mcom]Please do not promote your upload in the comments. You may use your signature or profile for that.[/mcom]",
    staffPM:
      "Please do not promote your upload in the comments. You may use your signature or profile for that.",
  },
  {
    id: "reseed",
    title: "re-seed request",
    text: '[mcom]Please do not request re-seeds in the comments. You may use the "Request Re-seed Tool" near the top of the page. This becomes available if a torrent goes unseeded for more than 24 hours. Alternatively, if a torrent has stalled, you may send us a Staff PM asking us to send out a manual re-seed request.[/mcom]',
    staffPM:
      'Please do not request re-seeds in the comments. You may use the "Request Re-seed Tool" near the top of the page. This becomes available if a torrent goes unseeded for more than 24 hours. Alternatively, if a torrent has stalled, you may send us a Staff PM asking us to send out a manual re-seed request.',
  },
  {
    id: "creditbeggar",
    title: "credits begging",
    text: "[mcom]:no2:[/mcom]",
    staffPM:
      "Don't beg for credits outside of the proper forum - https://www.empornium.is/forum/47",
  },
  {
    id: "crowdfunding",
    title: "crowdfunding",
    text: "[mcom]:no2:[/mcom]",
    staffPM:
      "Monetary transactions between users or crowdfunding are forbidden.",
  },
  {
    id: "doxxing",
    title: "doxxing",
    text: "[mcom]:no2:[/mcom]",
    staffPM:
      "Under no circumstances are the real names or personal information of porn stars to be revealed. Doxxing is strictly prohibited and will not be tolerated.",
  },
  {
    id: "imagehost",
    title: "external imagehost",
    text: "[mcom]In the future please use our https://www.empornium.is/articles/view/approvedimg for sharing images in the forums.[/mcom]",
    staffPM:
      "In the future please use our https://www.empornium.is/articles/view/approvedimg for sharing images in the forums.",
  },
  {
    id: "filesharing",
    title: "file sharing",
    text: "[mcom]Content must be shared via torrent only.[/mcom]",
    staffPM: "Content must be shared via torrent only.",
  },
  {
    id: "fc",
    title: "FC",
    text: "[mcom]:no2:[/mcom]",
    staffPM:
      "Do not discuss forbidden content anywhere on the site. Your post has been edited.",
  },
  {
    id: "ua",
    title: "UA",
    text: "[mcom]Do not embed videos or pictures that feature underage people.[/mcom]",
    staffPM: "Do not embed videos or pictures that feature underage people.",
  },
  {
    id: "invite",
    title: "asking for invites",
    text: "[mcom]:no2:[/mcom]",
    staffPM:
      "Asking for invites anywhere on EMP is strictly forbidden. Your post has been edited.",
  },
  {
    id: "filehost",
    title: "links to filehost",
    text: "[mcom]No links to filehosts, please.[/mcom]",
    staffPM:
      "Links to filehosts are not allowed on Emp. Your post has been edited.",
  },
  {
    id: "english",
    title: "not English",
    text: "[mcom]English only[/mcom]",
    staffPM:
      "https://www.empornium.is/articles/view/rules\n[quote]All forum posts and torrent comments must be in English only. The only area of the site where languages other than English are permitted is https://www.empornium.is/forum/17.[/quote]",
  },
  {
    id: "pa",
    title: "PA",
    text: "[mcom]Personal attacks against other users will not be tolerated.[/mcom]",
    staffPM:
      "Do not call other users names. If you disagree with their opinion you can discuss it without relying on personal attacks. Those will not be tolerated. Your post has been edited.",
  },
  {
    id: "politics",
    title: "politics",
    text: "[mcom]1.10 Politics are not allowed as a post or as a discussion topic anywhere on Empornium. We have an IRC channel just for politics if you wish to discuss them. #SoapBoxStation[/mcom]",
    staffPM:
      "1.10 Politics are not allowed as a post or as a discussion topic anywhere on Empornium. We have an IRC channel just for politics if you wish to discuss them. #SoapBoxStation",
  },
  {
    id: "ua_talk",
    title: "UA",
    text: "[mcom]:no2:[/mcom]",
    staffPM:
      "Do not talk about minors in a sexual context anywhere on Emp. Your post has been edited.",
  },
  {
    id: "descriptionfix",
    title: "title/description fix",
    text: "[mcom]If you believe something is wrong with a torrent, just make use of the report function at the top of the page. We will be able to deal with any potential issues faster than with a regular comment.[/mcom]",
    staffPM:
      "If you believe something is wrong with a torrent, just make use of the report function at the top of the page. We will be able to deal with any potential issues faster than with a regular comment.",
  },
  {
    id: "spamming",
    title: "Spamming the comments",
    text: "",
    staffPM:
      'It has come to our attention that you appear to be spamming comments. You have posted a large number of comments in a short period of time many of which are the same copied & pasted message.\nWhile we want people to show appreciation for the efforts of our uploaders that is not what you appear to be doing.\nIf you just want to say "Thanks" we have a button for that. If you want make a comment about a specific upload that would be great. But do not continue to post spam.',
  },
];

// {
//     id: "",
//     title: "",
//     text: "",
//     staffPM: "",
//   },
