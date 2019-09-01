let str2 = '{"items":[{"id":"UelDrZ1aFeY","snippet":{"channelId":"UC4dqLAF7yT-_DqeYisQ001w","title":"The Beatles - Something","categoryId":"10"},"statistics":{"viewCount":"37753911","likeCount":"223196","dislikeCount":"5219","favoriteCount":"0","commentCount":"10199"}},{"id":"zVO5xTAbxm8","snippet":{"channelId":"UCweOkPb1wVVH0Q0Tlj4a5Pw","title":"[MV] GIRL\'S DAY(걸스데이) _ Something (Dance ver.)","categoryId":"10"},"statistics":{"viewCount":"20786101","likeCount":"232369","dislikeCount":"4721","favoriteCount":"0","commentCount":"4463"}},{"id":"MZ3Vh8jZFdE","snippet":{"channelId":"UC4dqLAF7yT-_DqeYisQ001w","title":"The Beatles - Something (2019 Mix / Audio)","categoryId":"10"},"statistics":{"viewCount":"236469","likeCount":"12009","dislikeCount":"79","favoriteCount":"0","commentCount":"1272"}},{"id":"QWbAaTDlBls","snippet":{"channelId":"UC4X6zEK1HpuCdfkiu0lJMLA","title":"Lasgo - Something","categoryId":"10"},"statistics":{"viewCount":"48175287","likeCount":"214167","dislikeCount":"7047","favoriteCount":"0","commentCount":"7459"}},{"id":"JO7qQ7peKeM","snippet":{"channelId":"UCweOkPb1wVVH0Q0Tlj4a5Pw","title":"[MV] GIRL\'S DAY(걸스데이) _ Something(썸씽)","categoryId":"10"},"statistics":{"viewCount":"17096518","likeCount":"147880","dislikeCount":"6191","favoriteCount":"0","commentCount":"4470"}}]}'
let str3 = _getData()
let data = []

let nextPageToken = ''

async function getData(value) {
  
  return JSON.parse(str2).items.map(item => item.snippet.title)

  // let data = e.target.value;
  // console.log(data)
  let apiKey = 'AIzaSyCpk4nP_0xD6dm0O-AmJPWYS7EDUiahobo'

  let uri = `
      https://www.googleapis.com/youtube/v3/search
      ?key=${apiKey}
      &type=video
      &part=snippet 
      &maxResults=${responseMaxResults}
      &q=${data}}
    `.replace(/[ \t\n]/g, "")

  let arr = []

  await new Promise((res, rej) => {
    fetch(uri)
    .then(data => data.json())
    .then(data => data.items.forEach(item => arr.push(item.snippet.title)))
    .then(res)
    .catch(rej)
  })
  
  return arr
}


function nextData(itemsPerPage) {  
  data = []
  let arr = []
  
  let stats = JSON.parse(str2).items;
  let videoData = str3.items
  
  function addData() {
    for(let i = 0; i < videoData.length; i++) {
      arr.push({
        image:        videoData[i].snippet.thumbnails.medium.url,
        title:        videoData[i].snippet.title,
        channelTitle: videoData[i].snippet.channelTitle,
        date:         videoData[i].snippet.publishedAt.substr(0, videoData[i].snippet.publishedAt.indexOf('T')),
        description:  videoData[i].snippet.description,
        videoId:      videoData[i].id.videoId,
        view_count:   stats[i].statistics.viewCount,
      })
    }
  }
  
  for(let i = 0; i < pages; i++) {
    addData()
  }

  let res = chunk(arr, itemsPerPage)
  
  data = res.slice(0, pages)    
}

function _getData() {
  return {
    "kind":"youtube#searchListResponse",
    "etag":"\"8jEFfXBrqiSrcF6Ee7MQuz8XuAM/TuEk6tPnWkezfmiBGARBc69Td-c\"",
    "nextPageToken":"CAUQAA",
    "regionCode":"BY",
    "pageInfo":{
      "totalResults":1000000,
      "resultsPerPage":5
    },
    "items":[
      {
        "kind":"youtube#searchResult",
        "etag":"\"8jEFfXBrqiSrcF6Ee7MQuz8XuAM/xckbd2CZvQkpgA7vhhJCdT_0-lc\"",
        "id":{
          "kind":"youtube#video",
          "videoId":"UelDrZ1aFeY"
        },
        "snippet":{
          "publishedAt":"2017-12-15T16:14:30.000Z",
          "channelId":"UC4dqLAF7yT-_DqeYisQ001w",
          "title":"The Beatles - Something",
          "description":"Official site: http://www.thebeatles.com Facebook: https://www.facebook.com/thebeatles/ Instagram: https://www.instagram.com/thebeatles Twitter: ...",
          "thumbnails":{
            "default":{
              "url":"https://i.ytimg.com/vi/UelDrZ1aFeY/default.jpg",
              "width":120,
              "height":90
            },
            "medium":{
              "url":"https://i.ytimg.com/vi/UelDrZ1aFeY/mqdefault.jpg",
              "width":320,
              "height":180
            },
            "high":{
              "url":"https://i.ytimg.com/vi/UelDrZ1aFeY/hqdefault.jpg",
              "width":480,
              "height":360
            }
          },
          "channelTitle":"TheBeatlesVEVO",
          "liveBroadcastContent":"none"
        }
      },
      {
        "kind":"youtube#searchResult",
        "etag":"\"8jEFfXBrqiSrcF6Ee7MQuz8XuAM/pCwoYOW3JqHI66o4_VlXLpceyxA\"",
        "id":{
          "kind":"youtube#video",
          "videoId":"zVO5xTAbxm8"
        },
        "snippet":{
          "publishedAt":"2014-01-16T09:55:53.000Z",
          "channelId":"UCweOkPb1wVVH0Q0Tlj4a5Pw",
          "title":"[MV] GIRL'S DAY(걸스데이) _ Something (Dance ver.)",
          "description":"[MV] GIRL'S DAY(걸스데이) _ Something (Dance ver.) LOEN MUSIC changes the name to '1theK[wʌnðəkeɪ]' to be a global K-POP hub! 로엔뮤직이 새 이름 ...",
          "thumbnails":{
            "default":{
              "url":"https://i.ytimg.com/vi/zVO5xTAbxm8/default.jpg",
              "width":120,
              "height":90
            },
            "medium":{
              "url":"https://i.ytimg.com/vi/zVO5xTAbxm8/mqdefault.jpg",
              "width":320,
              "height":180
            },
            "high":{
              "url":"https://i.ytimg.com/vi/zVO5xTAbxm8/hqdefault.jpg",
              "width":480,
              "height":360
            }
          },
          "channelTitle":"1theK (원더케이)",
          "liveBroadcastContent":"none"
        }
      },
      {
        "kind":"youtube#searchResult",
        "etag":"\"8jEFfXBrqiSrcF6Ee7MQuz8XuAM/sr1Dh1kE1GAb5pUyP1eSqHYuF64\"",
        "id":{
          "kind":"youtube#video",
          "videoId":"MZ3Vh8jZFdE"
        },
        "snippet":{
          "publishedAt":"2019-08-08T13:00:07.000Z",
          "channelId":"UC4dqLAF7yT-_DqeYisQ001w",
          "title":"The Beatles - Something (2019 Mix / Audio)",
          "description":"Music video by The Beatles performing Something (2019 Mix / Audio). © 2019 Calderstone Productions Limited (a division of Universal Music Group) ...",
          "thumbnails":{
            "default":{
              "url":"https://i.ytimg.com/vi/MZ3Vh8jZFdE/default.jpg",
              "width":120,
              "height":90
            },
            "medium":{
              "url":"https://i.ytimg.com/vi/MZ3Vh8jZFdE/mqdefault.jpg",
              "width":320,
              "height":180
            },
            "high":{
              "url":"https://i.ytimg.com/vi/MZ3Vh8jZFdE/hqdefault.jpg",
              "width":480,
              "height":360
            }
          },
          "channelTitle":"TheBeatlesVEVO",
          "liveBroadcastContent":"none"
        }
      },
      {
        "kind":"youtube#searchResult",
        "etag":"\"8jEFfXBrqiSrcF6Ee7MQuz8XuAM/wa_afwUJyH00j1XMFlJzIie8uy0\"",
        "id":{
          "kind":"youtube#video",
          "videoId":"QWbAaTDlBls"
        },
        "snippet":{
          "publishedAt":"2010-07-12T18:08:22.000Z",
          "channelId":"UC4X6zEK1HpuCdfkiu0lJMLA",
          "title":"Lasgo - Something",
          "description":"Lasgo - Something.",
          "thumbnails":{
            "default":{
              "url":"https://i.ytimg.com/vi/QWbAaTDlBls/default.jpg",
              "width":120,
              "height":90
            },
            "medium":{
              "url":"https://i.ytimg.com/vi/QWbAaTDlBls/mqdefault.jpg",
              "width":320,
              "height":180
            },
            "high":{
              "url":"https://i.ytimg.com/vi/QWbAaTDlBls/hqdefault.jpg",
              "width":480,
              "height":360
            }
          },
          "channelTitle":"clmfsh",
          "liveBroadcastContent":"none"
        }
      },
      {
        "kind":"youtube#searchResult",
        "etag":"\"8jEFfXBrqiSrcF6Ee7MQuz8XuAM/3hCuDrnYscR1SOc2xWru3i8PphY\"",
        "id":{
          "kind":"youtube#video",
          "videoId":"JO7qQ7peKeM"
        },
        "snippet":{
          "publishedAt":"2014-01-03T03:00:00.000Z",
          "channelId":"UCweOkPb1wVVH0Q0Tlj4a5Pw",
          "title":"[MV] GIRL'S DAY(걸스데이) _ Something(썸씽)",
          "description":"[MV] GIRL'S DAY(걸스데이) _ Something LOEN MUSIC changes the name to '1theK[wʌnðəkeɪ]' to be a global K-POP hub! 로엔뮤직이 새 이름 '1theK(원더 ...",
          "thumbnails":{
            "default":{
              "url":"https://i.ytimg.com/vi/JO7qQ7peKeM/default.jpg",
              "width":120,
              "height":90
            },
            "medium":{
              "url":"https://i.ytimg.com/vi/JO7qQ7peKeM/mqdefault.jpg",
              "width":320,
              "height":180
            },
            "high":{
              "url":"https://i.ytimg.com/vi/JO7qQ7peKeM/hqdefault.jpg",
              "width":480,
              "height":360
            }
          },
          "channelTitle":"1theK (원더케이)",
          "liveBroadcastContent":"none"
        }
      }
    ]
  }
}