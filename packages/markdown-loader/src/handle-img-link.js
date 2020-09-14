'use strict';

// 用于匹配markdown中图片链接正则
const imgRegStr = '(!\\[.*\\]\\()(.*)(\\))';
const imgReg = new RegExp(imgRegStr, 'g');
const imgRegGlobalReg = new RegExp(imgRegStr);

/**
 * 如果markdown中有图片链接，
 * 通过wepback loader自带的loadModule功能加载图片模块
 */
function handleImg(source, { publicPath, loadModule, replaceSource }) {
    const linkMatches = source.match(imgRegGlobalReg);
    if (!linkMatches) {
        return Promise.resolve();
    }

    // 根据图片地址，加载图片模块
    const promises = linkMatches.map(
        link =>
            new Promise((resolve, reject) => {
                // 找到图片url
                const matcher = link.match(imgReg);
                // TODO: 这里做个优化
                if (!matcher) {
                    resolve();
                }
                const imgUrl = matcher[2];

                // 加载图片模块
                loadModule(imgUrl, (err, result) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (!result) {
                        reject(
                            new Error('you may need provide a src for image !')
                        );
                        return;
                    }

                    // TODO: 这里具体发生了什么
                    const resolvedPath = result
                        .split('+')[1]
                        .trim()
                        .slice(1, -2);

                    // TODO: 这里具体发生了什么
                    replaceSource(
                        link,
                        `${matcher[1]}${publicPath}${resolvedPath}${matcher[3]}`
                    );
                    // source = source.replace(link, `${matcher[1]}${publicPath}${resolvedPath}${matcher[3]}`);

                    resolve();
                });
            })
    );
    return Promise.all(promises);
}

module.exports = handleImg;
