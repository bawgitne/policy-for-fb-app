// Lưu ý: Đây là ví dụ mang tính khái niệm và sẽ không chạy được nếu không chỉnh sửa.

document.addEventListener('DOMContentLoaded', function() {
    const loginButton = document.getElementById('loginButton'); // Giả sử bạn có một nút với id="loginButton" trong popup.html
  
    loginButton.addEventListener('click', function() {
      // 1. Xây dựng URL Đăng nhập Facebook với các quyền (scopes) cần thiết
      const appId = '737588288884648'; // Thay bằng App ID của bạn
      const redirectUri = 'https://fb.com/bang19cm'; // URL chuyển hướng đặc biệt của Chrome extension
      const scope = 'email,public_profile'; // Xin quyền email và thông tin công khai. Quyền bạn bè (user_friends) rất hạn chế.
  
      const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&response_type=token`;
  
      // 2. Mở cửa sổ xác thực của Facebook
      chrome.identity.launchWebAuthFlow({
        url: authUrl,
        interactive: true
      }, function(redirect_url) {
        if (chrome.runtime.lastError || !redirect_url) {
          console.error("Lỗi xác thực:", chrome.runtime.lastError);
          return;
        }
  
        // 3. Lấy access token từ URL chuyển hướng
        const url = new URL(redirect_url);
        const accessToken = url.hash.split('=')[1].split('&')[0];
  
        if (accessToken) {
          getUserData(accessToken);
        }
      });
    });
  
    // 4. Khi bạn đã có access token, hãy gọi API
    function getUserData(accessToken) {
      fetch(`https://graph.facebook.com/me?fields=id,name,email,picture.width(200).height(200),friends&access_token=${accessToken}`)
        .then(response => response.json())
        .then(data => {
          // 5. Hiển thị thông tin người dùng trong giao diện của extension
          console.log(data); // In dữ liệu ra console để kiểm tra
          if(data.name) document.getElementById('userName').textContent = "Tên: " + data.name;
          if(data.email) document.getElementById('userEmail').textContent = "Email: " + data.email;
          if(data.picture) document.getElementById('userAvatar').src = data.picture.data.url;
          // Xử lý dữ liệu bạn bè (lưu ý về các hạn chế)
          if(data.friends) console.log("Bạn bè:", data.friends);
        })
        .catch(error => console.error('Lỗi khi lấy dữ liệu:', error));
    }
  });