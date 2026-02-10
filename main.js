<script>
// 간단한 스크롤 애니메이션 및 토글 메뉴
function toggleMenu() {
    alert('모바일 메뉴 버튼이 클릭되었습니다. 여기에 사이드바 로직을 추가할 수 있습니다.');
}

// 스크롤 시 헤더 그림자 효과
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    } else {
        header.style.boxShadow = 'none';
    }
});
</script>