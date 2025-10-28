# 접근성 가이드라인 (Accessibility Guidelines)

**문서 버전**: 1.0
**작성일**: 2025-10-23
**대상**: HeartCheck 모바일 애플리케이션

---

## 📋 개요

이 문서는 HeartCheck 모바일 애플리케이션의 접근성(Accessibility)을 보장하기 위한 가이드라인입니다. 모든 사용자가 장애 유무와 관계없이 앱을 효과적으로 사용할 수 있도록 WCAG 2.1 Level AA 기준을 준수합니다.

---

## 🎯 접근성 목표

1. **인지성 (Perceivable)**: 모든 사용자가 정보를 인지할 수 있어야 함
2. **운용성 (Operable)**: 모든 사용자가 인터페이스를 조작할 수 있어야 함
3. **이해성 (Understandable)**: 정보와 UI 조작이 이해 가능해야 함
4. **견고성 (Robust)**: 다양한 보조 기술과 호환되어야 함

---

## 📱 React Native 접근성 API

### 기본 접근성 속성

```typescript
<View
  accessible={true}                         // 접근 가능한 요소로 표시
  accessibilityLabel="사용자 이름"         // 스크린 리더가 읽을 라벨
  accessibilityHint="프로필을 보려면 탭하세요"  // 추가 설명
  accessibilityRole="button"               // 요소의 역할
  accessibilityState={{selected: true}}    // 요소의 상태
/>
```

### 주요 속성 설명

| 속성 | 설명 | 사용 예시 |
|------|------|----------|
| `accessible` | 요소를 접근 가능하게 만듦 | 모든 인터랙티브 요소 |
| `accessibilityLabel` | 스크린 리더가 읽을 텍스트 | "로그인 버튼" |
| `accessibilityHint` | 추가 동작 설명 | "이메일 주소를 입력하세요" |
| `accessibilityRole` | 요소의 의미적 역할 | button, text, image 등 |
| `accessibilityState` | 요소의 현재 상태 | selected, disabled, checked |
| `accessibilityValue` | 현재 값 (슬라이더 등) | {min: 0, max: 100, now: 50} |

---

## ✅ 접근성 베스트 프랙티스

### 1. 스크린 리더 지원 (Screen Reader)

#### iOS: VoiceOver
#### Android: TalkBack

**구현 사례**:

```typescript
// ✅ 좋은 예
<TouchableOpacity
  accessible={true}
  accessibilityLabel="로그인"
  accessibilityHint="탭하여 로그인 화면으로 이동"
  accessibilityRole="button"
  onPress={handleLogin}
>
  <Text>로그인</Text>
</TouchableOpacity>

// ❌ 나쁜 예
<TouchableOpacity onPress={handleLogin}>
  <Text>로그인</Text>
</TouchableOpacity>
```

**체크리스트**:
- [ ] 모든 버튼에 `accessibilityLabel` 설정
- [ ] 아이콘 버튼에 명확한 라벨 제공
- [ ] 이미지에 `accessibilityLabel` 제공 (의미 있는 경우)
- [ ] 장식용 이미지는 `accessible={false}` 설정
- [ ] 동적 콘텐츠 변경 시 `accessibilityLiveRegion` 사용

---

### 2. 색상 대비 (Color Contrast)

WCAG 2.1 AA 기준:
- **일반 텍스트**: 최소 4.5:1 대비
- **큰 텍스트 (18pt+)**: 최소 3:1 대비
- **UI 컴포넌트**: 최소 3:1 대비

**현재 구현 확인**:

```typescript
// colors.ts 체크
const colors = {
  text: '#1F2937',        // 검정 계열 (흰 배경 대비 충분)
  background: '#FFFFFF',  // 흰색
  primary: {
    500: '#3B82F6',      // 파랑 (대비 확인 필요)
  },
  error: {
    500: '#EF4444',      // 빨강 (충분한 대비)
  },
};
```

**체크리스트**:
- [ ] 모든 텍스트 색상이 4.5:1 이상 대비
- [ ] 버튼 배경과 텍스트 대비 충분
- [ ] 에러 메시지가 색상만으로 전달되지 않음
- [ ] 다크 모드에서도 대비 충분
- [ ] 색맹 사용자를 위한 패턴/아이콘 사용

**도구**:
- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
- Stark (Figma Plugin)

---

### 3. 터치 타겟 크기 (Touch Target Size)

**최소 크기**: 44x44 포인트 (iOS), 48x48 dp (Android)

```typescript
// ✅ 좋은 예
<TouchableOpacity
  style={{
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  }}
>
  <Text>버튼</Text>
</TouchableOpacity>

// ❌ 나쁜 예
<TouchableOpacity style={{width: 20, height: 20}}>
  <Text>X</Text>
</TouchableOpacity>
```

**체크리스트**:
- [ ] 모든 버튼이 최소 44x44 크기
- [ ] 아이콘 버튼에 충분한 패딩
- [ ] 인접한 버튼 간 최소 8px 간격
- [ ] 작은 터치 영역은 `hitSlop` 속성 사용

```typescript
<TouchableOpacity
  hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
>
  <Image source={smallIcon} />
</TouchableOpacity>
```

---

### 4. 폼 접근성 (Form Accessibility)

**입력 필드 라벨링**:

```typescript
// ✅ 좋은 예
<View>
  <Text
    accessible={false}  // 라벨은 읽지 않음
    style={styles.label}
  >
    이메일
  </Text>
  <TextInput
    accessible={true}
    accessibilityLabel="이메일 주소"
    accessibilityHint="example@email.com 형식으로 입력하세요"
    placeholder="email@example.com"
    keyboardType="email-address"
    autoCapitalize="none"
  />
</View>
```

**에러 메시지**:

```typescript
{error && (
  <Text
    accessible={true}
    accessibilityRole="alert"
    accessibilityLiveRegion="polite"
    style={styles.errorText}
  >
    {error}
  </Text>
)}
```

**체크리스트**:
- [ ] 모든 입력 필드에 명확한 라벨
- [ ] 필수 필드 표시 (시각적 + 스크린 리더)
- [ ] 에러 메시지가 즉시 안내됨
- [ ] 입력 형식 힌트 제공
- [ ] 자동 포커스로 사용자 안내

---

### 5. 네비게이션 접근성

**포커스 순서**:

```typescript
// 포커스 순서 제어
<View
  accessible={true}
  accessibilityRole="header"
  accessibilityLabel="로그인 화면"
>
  <Text style={styles.title}>로그인</Text>
</View>

<TextInput
  ref={emailRef}
  returnKeyType="next"
  onSubmitEditing={() => passwordRef.current?.focus()}
  // ...
/>

<TextInput
  ref={passwordRef}
  returnKeyType="done"
  onSubmitEditing={handleSubmit}
  // ...
/>
```

**모달 접근성**:

```typescript
<Modal
  visible={isVisible}
  accessible={true}
  accessibilityViewIsModal={true}  // 모달 외부 요소 차단
  onRequestClose={handleClose}
>
  <View
    accessible={true}
    accessibilityLabel="알림 다이얼로그"
    accessibilityRole="alert"
  >
    {/* 모달 내용 */}
  </View>
</Modal>
```

**체크리스트**:
- [ ] 논리적인 포커스 순서
- [ ] 탭 키로 모든 요소 접근 가능
- [ ] 모달 열릴 때 포커스 이동
- [ ] 모달 닫힐 때 원래 위치로 포커스 복귀
- [ ] 뒤로 가기 버튼 항상 제공

---

### 6. 다국어 지원 (i18n)

**텍스트 크기 조절**:

```typescript
import {Text} from 'react-native';

// ✅ Dynamic Type 지원
<Text
  style={{
    fontSize: 16,
    lineHeight: 24,
    // RN은 자동으로 시스템 폰트 크기 조절 반영
  }}
  allowFontScaling={true}  // 기본값 true
>
  {t('common.welcome')}
</Text>
```

**RTL (Right-to-Left) 지원**:

```typescript
import {I18nManager} from 'react-native';

// RTL 활성화 여부 확인
const isRTL = I18nManager.isRTL;

<View style={{
  flexDirection: isRTL ? 'row-reverse' : 'row',
  textAlign: isRTL ? 'right' : 'left',
}}>
  {/* 콘텐츠 */}
</View>
```

**체크리스트**:
- [ ] 모든 텍스트가 시스템 폰트 크기 조절 반영
- [ ] 최대 200% 확대 시에도 레이아웃 유지
- [ ] 하드코딩된 텍스트 없음 (모두 i18n)
- [ ] RTL 언어 지원 (아랍어, 히브리어 등)

---

### 7. 멀티미디어 접근성

**이미지 대체 텍스트**:

```typescript
// ✅ 의미 있는 이미지
<Image
  source={require('./logo.png')}
  accessible={true}
  accessibilityLabel="HeartCheck 로고"
/>

// ✅ 장식용 이미지
<Image
  source={require('./decoration.png')}
  accessible={false}  // 스크린 리더가 무시
/>
```

**아이콘 라벨링**:

```typescript
<TouchableOpacity
  accessible={true}
  accessibilityLabel="설정"
  accessibilityRole="button"
>
  <Icon name="settings" size={24} color="#333" />
</TouchableOpacity>
```

**체크리스트**:
- [ ] 모든 의미 있는 이미지에 `accessibilityLabel`
- [ ] 장식용 이미지는 `accessible={false}`
- [ ] 아이콘만 있는 버튼에 명확한 라벨
- [ ] 차트/그래프에 텍스트 요약 제공

---

### 8. 동작 및 제스처

**대체 입력 방법 제공**:

```typescript
// ✅ 스와이프 대신 버튼 제공
<View>
  <ScrollView horizontal>
    {items.map(item => <Card key={item.id} {...item} />)}
  </ScrollView>

  {/* 스크린 리더 사용자를 위한 대체 네비게이션 */}
  <View accessible={true} accessibilityRole="tablist">
    <Button title="이전" onPress={goPrevious} />
    <Button title="다음" onPress={goNext} />
  </View>
</View>
```

**체크리스트**:
- [ ] 복잡한 제스처에 대한 대체 방법 제공
- [ ] 시간 제한 없음 또는 연장 옵션 제공
- [ ] 실수로 동작 취소 가능
- [ ] 중요한 동작은 확인 다이얼로그 표시

---

## 🧪 접근성 테스트

### iOS (VoiceOver)

**활성화**:
1. 설정 → 접근성 → VoiceOver → 켜기
2. 단축키: 홈 버튼 3번 클릭

**테스트 항목**:
- [ ] 모든 UI 요소가 VoiceOver로 선택 가능
- [ ] 라벨이 명확하고 이해하기 쉬움
- [ ] 버튼 탭 시 "버튼"이라고 안내됨
- [ ] 입력 필드에 포커스 시 힌트 안내됨
- [ ] 모달 열릴 때 제목/내용 안내됨

### Android (TalkBack)

**활성화**:
1. 설정 → 접근성 → TalkBack → 켜기
2. 단축키: 볼륨 키 양쪽 동시에 3초

**테스트 항목**:
- [ ] 모든 UI 요소가 TalkBack으로 선택 가능
- [ ] 라벨이 명확하고 한국어로 읽힘
- [ ] 터치 탐색 모드에서 모든 요소 접근
- [ ] 제스처로 네비게이션 가능
- [ ] 알림 메시지가 즉시 안내됨

### 자동화 테스트

```typescript
// Jest + React Native Testing Library
import {render} from '@testing-library/react-native';
import {Button} from '../components/Button';

test('Button has accessibility label', () => {
  const {getByLabelText} = render(
    <Button label="로그인" onPress={() => {}} />
  );

  const button = getByLabelText('로그인');
  expect(button).toBeTruthy();
  expect(button.props.accessibilityRole).toBe('button');
});
```

---

## 📋 접근성 체크리스트

### 화면별 체크리스트

#### 로그인 화면
- [ ] 이메일 입력 필드에 명확한 라벨
- [ ] 비밀번호 입력 필드에 보안 안내
- [ ] "로그인" 버튼에 적절한 라벨
- [ ] "비밀번호 찾기" 링크 접근 가능
- [ ] 에러 메시지가 즉시 안내됨

#### 평가 화면
- [ ] 각 폼 필드에 명확한 라벨
- [ ] 필수 필드 표시
- [ ] 단계 진행 상황 안내
- [ ] "다음" 버튼 상태 안내 (활성/비활성)
- [ ] 입력 형식 힌트 제공

#### 결과 화면
- [ ] 위험 수준이 색상+텍스트로 전달됨
- [ ] 권장 사항이 목록으로 명확히 안내됨
- [ ] 차트에 텍스트 요약 제공
- [ ] "저장" 버튼 접근 가능

#### 설정 화면
- [ ] 모든 설정 항목이 명확히 라벨링됨
- [ ] 스위치 상태 (켜짐/꺼짐) 안내됨
- [ ] 언어 변경 시 즉시 반영
- [ ] 테마 변경 시 대비 유지

---

## 🛠️ 접근성 개선 도구

### 개발 도구
- **React Native Accessibility API**: 기본 제공
- **Accessibility Inspector** (Xcode): iOS 접근성 트리 확인
- **Accessibility Scanner** (Android Studio): Android 접근성 이슈 탐지

### 테스트 도구
- **Axe DevTools**: 자동화된 접근성 테스트
- **Pa11y**: CI/CD 통합 가능한 접근성 검사
- **Lighthouse**: 웹뷰 접근성 검사

### 디자인 도구
- **Stark (Figma)**: 색상 대비 검사
- **Contrast (macOS)**: 실시간 대비 검사
- **Color Oracle**: 색맹 시뮬레이터

---

## 📚 참고 자료

### 가이드라인
- **WCAG 2.1**: https://www.w3.org/WAI/WCAG21/quickref/
- **React Native Accessibility**: https://reactnative.dev/docs/accessibility
- **iOS Human Interface Guidelines**: https://developer.apple.com/design/human-interface-guidelines/accessibility
- **Android Accessibility**: https://developer.android.com/guide/topics/ui/accessibility

### 학습 자료
- **WebAIM**: https://webaim.org/
- **A11y Project**: https://www.a11yproject.com/
- **Inclusive Components**: https://inclusive-components.design/

---

## 🎓 접근성 교육

### 팀 교육 주제
1. **접근성 기초**: WCAG 원칙, 장애 유형 이해
2. **스크린 리더 사용법**: VoiceOver, TalkBack 실습
3. **React Native 접근성 API**: 실전 구현 예제
4. **자동화 테스트**: Jest로 접근성 테스트 작성
5. **디자인 접근성**: 색상 대비, 타이포그래피, 레이아웃

### 지속적인 개선
- [ ] 매 스프린트 접근성 이슈 1개 이상 해결
- [ ] 신규 화면 개발 시 접근성 체크리스트 확인
- [ ] 월 1회 스크린 리더 테스트 수행
- [ ] 분기 1회 외부 접근성 감사

---

## 📊 접근성 성숙도 모델

### Level 1: 기본 (Basic)
- [ ] 모든 버튼에 라벨 설정
- [ ] 이미지에 대체 텍스트 제공
- [ ] 최소 색상 대비 충족

### Level 2: 개선 (Improved)
- [ ] 폼 검증 및 에러 처리
- [ ] 키보드/스크린 리더 네비게이션
- [ ] 포커스 관리

### Level 3: 고급 (Advanced)
- [ ] 동적 콘텐츠 Live Region 지원
- [ ] 복잡한 제스처 대체 방법
- [ ] RTL 언어 지원

### Level 4: 우수 (Excellent)
- [ ] WCAG 2.1 AAA 일부 준수
- [ ] 자동화된 접근성 테스트 CI/CD 통합
- [ ] 정기적인 접근성 감사

**현재 목표**: Level 2 (개선) 달성

---

**문서 작성자**: Claude Code
**최종 업데이트**: 2025-10-23
**다음 검토일**: 2026-01-23
