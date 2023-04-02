/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null;
  }
  const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}";
  let date;
  if (typeof time === "object") {
    date = time;
  } else {
    if (typeof time === "string") {
      if (/^[0-9]+$/.test(time)) {
        // support "1548221490638"
        time = parseInt(time);
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), "/");
      }
    }

    if (typeof time === "number" && time.toString().length === 10) {
      time = time * 1000;
    }
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  };
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key];
    // Note: getDay() returns 0 on Sunday
    if (key === "a") {
      return ["日", "一", "二", "三", "四", "五", "六"][value];
    }
    return value.toString().padStart(2, "0");
  });
  return time_str;
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (("" + time).length === 10) {
    time = parseInt(time) * 1000;
  } else {
    time = +time;
  }
  const d = new Date(time);
  const now = Date.now();

  const diff = (now - d) / 1000;

  if (diff < 30) {
    return "刚刚";
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + "分钟前";
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + "小时前";
  } else if (diff < 3600 * 24 * 2) {
    return "1天前";
  }
  if (option) {
    return parseTime(time, option);
  } else {
    return (
      d.getMonth() +
      1 +
      "月" +
      d.getDate() +
      "日" +
      d.getHours() +
      "时" +
      d.getMinutes() +
      "分"
    );
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split("?")[1]).replace(/\+/g, " ");
  if (!search) {
    return {};
  }
  const obj = {};
  const searchArr = search.split("&");
  searchArr.forEach((v) => {
    const index = v.indexOf("=");
    if (index !== -1) {
      const name = v.substring(0, index);
      const val = v.substring(index + 1, v.length);
      obj[name] = val;
    }
  });
  return obj;
}
export function deepClone(origin, target) {
  const tar = target || {};
  // const arrtype = '[object Array]'
  // const tostr = Object.prototype.toString
  const hasown = Object.prototype.hasOwnProperty;

  for (var i in origin) {
    if (hasown.call(origin, i)) {
      if (typeof origin[i] === "object" && origin[i] !== null) {
        // tar[i]=tostr.call(origin[i])===arrtype ? [] : {}
        tar[i] = new origin[i].constructor();
        deepClone(origin[i], tar[i]);
      } else {
        tar[i] = origin[i];
      }
    }
  }
  return tar;
}

export function getTableHeight(el) {
  if (el.$el) {
    return document.body.offsetHeight - el.$el.offsetHeight - 50;
  } else {
    const computedStyle = document.defaultView.getComputedStyle(el);
    return document.body.offsetHeight - parseInt(computedStyle.height) - 50;
  }
}
export function formatToAreaTree(list, myid = 0, tree) {
  // 遍历整个列表
  return list.filter((cur) => {
    // 获取当前节点的子节点
    const children = list.filter((item) => item.parentId === cur.id);
    if (children.length > 0) {
      cur.children = children;
    }
    // 只返回顶级节点
    if (tree === "self") {
      return cur.id === myid;
    } else {
      return cur.parentId === myid;
    }
  });
}

export function downloadBuffer(data, name = "我的表格") {
  const ar = new ArrayBuffer(1024);
  console.log(Object.prototype.toString.call(ar), "ar");
  console.log(Object.prototype.toString.call(data), "data");
  const blob = new Blob([new Int8Array(data)], {
    type: "application/vnd.ms-excel;charset=utf-8",
  });

  const href = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = href;
  a.download = `${name}.xlsx`;
  a.click();
  URL.revokeObjectURL(a.href); // 释放URL对象
}
export function dataURLtoBlobUrl(dataUrl) {
  const arr = dataUrl.split(","),
    mine = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]);
  let n = bstr.length;
  const ab = new ArrayBuffer(n);

  const u8Arr = new Uint8Array(ab);

  while (n--) {
    u8Arr[n] = bstr.charCodeAt(n);
  }
  const blob = new Blob([u8Arr], { type: mine });
  const url = URL.createObjectURL(blob);
  return url;
}

export function dataURLtoBlobUrlByFetch(dataUrl) {
  return new Promise((resolve, reject) => {
    fetch(dataUrl)
      .then((r) => {
        return r.blob();
      })
      .then((b) => {
        const url = URL.createObjectURL(b);
        resolve(url);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function dataURLtoBlobUrlByAxios(dataUrl) {
  return new Promise((resolve, reject) => {
    fetch(dataUrl)
      .then((r) => {
        console.log(r, "来的");
        return r.arrayBuffer();
      })
      .then((b) => {
        return new Uint8Array(b);
      })
      .then((bl) => {
        console.log(ArrayBuffer.isView(bl), "b-sview");
        console.log(Object.prototype.toString.call(bl), "b-sview");
        console.log(bl, "length-offset");
        const blob = new Blob([bl]);
        console.log(blob, "blob");
        const url = URL.createObjectURL(blob);
        resolve(url);
      });
  });
}

export function blobToDataURI(blob, callback) {
  var reader = new FileReader();
  reader.readAsDataURL(blob);
  reader.onload = function (e, f) {
    console.log(e, f, "e.xx");
    const img = new Image();
    img.src = e.target.result;
    console.log(img.naturalWidth, "原始的数据");
    img.onload = (res) => {
      console.log(res, "rexx,img loadding");
    };

    console.log(img.width, "生成的img");
    callback(e.target.result);
  };
}

// 根据buffer中的文件头信息判断图片类型
export function getImageType(buffer) {
  let fileType = "";
  if (buffer) {
    const view = new DataView(buffer);
    const first4Byte = view.getUint32(0, false);
    const hexValue = Number(first4Byte).toString(16).toUpperCase();
    switch (hexValue) {
      case "FFD8FFDB":
        fileType = "JPG";
        break;
      case "FFD8FFE0":
      case "FFD8FFE1":
      case "FFD8FFE2":
      case "FFD8FFE3":
        fileType = "JPEG";
        break;
      case "89504E47":
        fileType = "PNG";
        break;
      case "47494638":
        fileType = "GIF";
        break;
      case "52494646":
        fileType = "WEBP";
        break;
      default:
        break;
    }
  }
  return fileType;
}
export function getNatural(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => {
      const imgObj = {
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
      };
      resolve(imgObj);
    });
    img.addEventListener("error", () => reject());
    img.src = url;
  });
}
// 获取图片二进制数据
export function getCanvasImgData(imgUrl, width = 0, height = 0) {
  if (imgUrl && width && height) {
    const img = new Image();
    img.src = imgUrl;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0, width, height);
    const imageData = ctx.getImageData(0, 0, width, height);
    return imageData;
  }
  return null;
}

export function getImgInfo(file, callback) {
  const { type } = file;
  const typeArr = type.split("/");
  if (typeArr[0] !== "image") return;
  let fileType = typeArr[1].toUpperCase();
  const reader = new FileReader();
  reader.onload = async (e) => {
    const buffer = e.target.result;
    const imageType = getImageType(buffer);
    if (imageType) {
      fileType = imageType;
    }
    const blob = new Blob([buffer]);
    const dataUrl = URL.createObjectURL(blob);
    const { width, height } = await getNatural(dataUrl);
    const imageData = getCanvasImgData(dataUrl, width, height);
    if (imageData) {
      const imgInfo = {
        name: file.name,
        fileType,
        size: file.size,
        width,
        height,
        imgUrl: dataUrl,
        imageData,
        blob,
      };
      callback(imgInfo);
    } else {
      callback(null);
    }
  };
  reader.readAsArrayBuffer(file);
}
