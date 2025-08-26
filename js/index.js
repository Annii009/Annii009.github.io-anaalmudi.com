function toggleMenu() {
            const hamburger = document.querySelector('.hamburger');
            const mobileMenu = document.getElementById('mobileMenu');
            const overlay = document.getElementById('overlay');
            
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            overlay.classList.toggle('active');
        }

        function closeMenu() {
            const hamburger = document.querySelector('.hamburger');
            const mobileMenu = document.getElementById('mobileMenu');
            const overlay = document.getElementById('overlay');
            
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            overlay.classList.remove('active');
        }

        function setActive(element, type) {
            if (type === 'desktop') {
                document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
                document.querySelectorAll('.mobile-nav-btn').forEach(btn => btn.classList.remove('active'));
            } else {
                document.querySelectorAll('.mobile-nav-btn').forEach(btn => btn.classList.remove('active'));
                document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
            }
            
            element.classList.add('active');
            const text = element.textContent;
            
            if (type === 'desktop') {
                document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
                    if (btn.textContent === text) {
                        btn.classList.add('active');
                    }
                });
            } else {
                document.querySelectorAll('.nav-btn').forEach(btn => {
                    if (btn.textContent === text) {
                        btn.classList.add('active');
                    }
                });
                closeMenu();
            }
        }

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeMenu();
            }
        });