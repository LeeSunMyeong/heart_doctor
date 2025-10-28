# 컴포넌트 매핑 가이드: React Web → React Native

**문서 생성일**: 2025-10-23
**단계**: Phase 0 - 마이그레이션 전 분석

---

## 개요

본 문서는 Readdy 웹 컴포넌트를 React Native 모바일 컴포넌트로 변환하기 위한 종합적인 매핑 가이드를 제공합니다. 각 매핑에는 코드 예제, 주의사항 및 모범 사례가 포함되어 있습니다.

---

## 1. 기본 HTML 요소

### 컨테이너 요소

#### DIV → VIEW
```javascript
// ❌ Readdy (웹)
<div className="flex items-center justify-center">
  <div className="bg-white rounded-lg p-4">
    Content here
  </div>
</div>

// ✅ Frontend (React Native)
<View className="flex items-center justify-center">
  <View className="bg-white rounded-lg p-4">
    Content here
  </View>
</View>
```

**Import**: `import { View } from 'react-native';`

**주의사항**:
- `<View>`는 내장 스크롤링이 없음 (`<ScrollView>` 사용)
- `onClick` 없음 → `TouchableOpacity`와 함께 `onPress` 사용
- 텍스트를 직접 포함할 수 없음 → `<Text>`로 감싸야 함

---

### 텍스트 요소

#### SPAN/P/H1-H6 → TEXT
```javascript
// ❌ Readdy (웹)
<div className="text-center">
  <h3 className="text-lg font-bold text-black mb-2">프리미엄 구독 필요</h3>
  <p className="text-sm text-gray-600 mb-4">무료 체험이 완료되었습니다</p>
  <span className="text-xs text-gray-500">bpm</span>
</div>

// ✅ Frontend (React Native)
<View className="text-center">
  <Text className="text-lg font-bold text-black mb-2">프리미엄 구독 필요</Text>
  <Text className="text-sm text-gray-600 mb-4">무료 체험이 완료되었습니다</Text>
  <Text className="text-xs text-gray-500">bpm</Text>
</View>
```

**Import**: `import { Text } from 'react-native';`

**주의사항**:
- 모든 텍스트는 `<Text>` 컴포넌트로 감싸야 함
- 시맨틱 HTML 태그 없음 (h1, h2, p, span) → 모두 `<Text>`가 됨
- 텍스트 스타일링이 웹과 다름 (`font-family` 단축어 없음)
- `<Text>` 안에 `<View>`를 중첩할 수 없음 (`<Text>` 안에 `<Text>`는 가능)

**스타일 매핑**:
| 웹 | React Native |
|-----|--------------|
| `<h1>` | `<Text className="text-4xl font-bold">` |
| `<h2>` | `<Text className="text-3xl font-bold">` |
| `<h3>` | `<Text className="text-2xl font-bold">` |
| `<p>` | `<Text className="text-base">` |
| `<span>` | `<Text>` |

---

### 인터랙티브 요소

#### BUTTON → TOUCHABLEOPACITY / PRESSABLE
```javascript
// ❌ Readdy (웹)
<button
  onClick={() => handleSubmit()}
  className="px-2 py-1 rounded text-xs font-medium bg-black text-white"
>
  Submit
</button>

// ✅ Frontend (React Native) - 옵션 1: TouchableOpacity
<TouchableOpacity
  onPress={() => handleSubmit()}
  className="px-2 py-1 rounded bg-black"
  activeOpacity={0.7}
>
  <Text className="text-xs font-medium text-white">Submit</Text>
</TouchableOpacity>

// ✅ Frontend (React Native) - 옵션 2: Pressable (더 많은 제어)
<Pressable
  onPress={() => handleSubmit()}
  className="px-2 py-1 rounded bg-black"
  style={({pressed}) => [
    {opacity: pressed ? 0.7 : 1}
  ]}
>
  <Text className="text-xs font-medium text-white">Submit</Text>
</Pressable>
```

**Import**:
```javascript
import { TouchableOpacity, Pressable } from 'react-native';
```

**사용 시기**:
- **TouchableOpacity**: 불투명도 피드백이 있는 간단한 버튼 (가장 일반적)
- **Pressable**: 프레스 상태, 리플 효과에 대한 더 많은 제어 필요
- **TouchableHighlight**: 프레스 시 배경색 변경 필요
- **TouchableWithoutFeedback**: 시각적 피드백 불필요

**주의사항**:
- `onClick` → `onPress`
- 텍스트를 `<Text>` 컴포넌트로 감싸야 함
- 기본적으로 `disabled` prop 스타일링 없음 (수동 구현 필요)
- `:hover` 상태 없음 (모바일에는 hover가 없음)

---

#### INPUT → TEXTINPUT
```javascript
// ❌ Readdy (웹)
<input
  type="number"
  value={data.age}
  onChange={(e) => handleInputChange('age', e.target.value)}
  placeholder="나이"
  className="flex-1 p-1.5 border border-gray-300 rounded text-xs"
  min="1"
  max="120"
/>

// ✅ Frontend (React Native)
<TextInput
  value={data.age}
  onChangeText={(text) => handleInputChange('age', text)}
  placeholder="나이"
  keyboardType="numeric"
  className="flex-1 p-1.5 border border-gray-300 rounded text-xs"
  maxLength={3}
  placeholderTextColor="#9CA3AF"
/>
```

**Import**: `import { TextInput } from 'react-native';`

**주요 차이점**:
| 웹 | React Native |
|-----|--------------|
| `onChange={(e) => ...}` | `onChangeText={(text) => ...}` |
| `e.target.value` | 직접 텍스트 값 |
| `type="number"` | `keyboardType="numeric"` |
| `type="email"` | `keyboardType="email-address"` |
| `type="password"` | `secureTextEntry={true}` |
| `min`, `max` | 수동 검증 필요 |
| `required` | 수동 검증 필요 |

**키보드 타입**:
- `default` - 기본 키보드
- `numeric` - 숫자 패드
- `email-address` - 이메일 키보드
- `phone-pad` - 전화번호 패드
- `decimal-pad` - 소수점 숫자 패드

**주의사항**:
- 네이티브 폼 검증 속성 없음
- 모든 검증을 JavaScript로 처리해야 함
- placeholder 색상을 명시적으로 설정해야 함
- 텍스트 색상과 placeholder 색상이 분리됨
- 자동 대문자화가 기본적으로 켜져 있음 (`autoCapitalize="none"` 사용)

---

### 링크/내비게이션 요소

#### LINK (React Router) → TOUCHABLE + NAVIGATION
```javascript
// ❌ Readdy (웹)
import { Link } from 'react-router-dom';

<Link to="/settings" className="p-3 bg-gray-100 rounded-full">
  <i className="ri-settings-3-line text-xl text-gray-700"></i>
</Link>

<Link to="/pricing" className="text-blue-600">
  프리미엄 구독하기
</Link>

// ✅ Frontend (React Native)
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const navigation = useNavigation();

<TouchableOpacity
  onPress={() => navigation.navigate('Settings')}
  className="p-3 bg-gray-100 rounded-full"
>
  <Icon name="settings-outline" size={24} color="#374151" />
</TouchableOpacity>

<TouchableOpacity onPress={() => navigation.navigate('Pricing')}>
  <Text className="text-blue-600">프리미엄 구독하기</Text>
</TouchableOpacity>
```

**내비게이션 Hook**:
```javascript
import { useNavigation } from '@react-navigation/native';

const navigation = useNavigation();

// 화면으로 이동
navigation.navigate('ScreenName');

// 파라미터와 함께 이동
navigation.navigate('ScreenName', { userId: 123 });

// 뒤로 가기
navigation.goBack();

// 현재 화면 교체
navigation.replace('ScreenName');
```

**주의사항**:
- URL 기반 라우팅 없음 (`/settings` 경로 없음)
- 화면 이름은 네비게이터 구성에서 정의됨
- 타입 안전 내비게이션을 위해서는 TypeScript 설정 필요
- `href` 속성 사용 불가

---

## 2. 레이아웃 컴포넌트

### 스크롤 가능한 컨테이너

#### DIV with overflow-scroll → SCROLLVIEW
```javascript
// ❌ Readdy (웹)
<div className="flex-1 px-4 py-2 overflow-y-auto">
  <div className="bg-gray-50 rounded-lg p-3">
    {/* 긴 콘텐츠 */}
  </div>
</div>

// ✅ Frontend (React Native)
<ScrollView className="flex-1 px-4 py-2">
  <View className="bg-gray-50 rounded-lg p-3">
    {/* 긴 콘텐츠 */}
  </View>
</ScrollView>
```

**Import**: `import { ScrollView } from 'react-native';`

**Props**:
- `showsVerticalScrollIndicator={false}` - 스크롤바 숨기기
- `bounces={true}` - iOS 바운스 효과
- `keyboardShouldPersistTaps="handled"` - 키보드 해제 처리
- `refreshControl={<RefreshControl />}` - 당겨서 새로고침

**주의사항**:
- 제한된 콘텐츠에는 `<ScrollView>` 사용
- 긴 리스트에는 `<FlatList>` 사용 (더 나은 성능)
- ScrollView 콘텐츠 내에서 `flex: 1` 사용 불가
- 제한된 높이가 있어야 함 (ScrollView를 중첩하지 마세요)

---

### 리스트 컨테이너

#### DIV with map() → FLATLIST
```javascript
// ❌ Readdy (웹)
<div className="space-y-2">
  {items.map((item) => (
    <div key={item.id} className="bg-white p-4 rounded">
      <h3>{item.title}</h3>
      <p>{item.description}</p>
    </div>
  ))}
</div>

// ✅ Frontend (React Native)
<FlatList
  data={items}
  keyExtractor={(item) => item.id.toString()}
  renderItem={({ item }) => (
    <View className="bg-white p-4 rounded mb-2">
      <Text className="font-bold">{item.title}</Text>
      <Text>{item.description}</Text>
    </View>
  )}
  ItemSeparatorComponent={() => <View className="h-2" />}
/>
```

**Import**: `import { FlatList } from 'react-native';`

**주요 Props**:
- `data` - 데이터 배열
- `renderItem` - 각 아이템의 렌더 함수
- `keyExtractor` - 각 아이템의 고유 키
- `ListEmptyComponent` - 빈 상태 컴포넌트
- `ListHeaderComponent` - 헤더 컴포넌트
- `ListFooterComponent` - 푸터 컴포넌트
- `onEndReached` - 무한 스크롤 콜백
- `refreshControl` - 당겨서 새로고침

**성능 최적화**:
```javascript
<FlatList
  data={items}
  renderItem={renderItem}
  keyExtractor={keyExtractor}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  updateCellsBatchingPeriod={50}
  initialNumToRender={10}
  windowSize={10}
/>
```

**주의사항**:
- 20개 이상의 아이템이 있는 리스트에 FlatList 사용
- `keyExtractor`를 올바르게 구현 (인덱스 피하기)
- 인라인 `renderItem` 함수 피하기 (성능)
- FlatList에 직접 padding 사용 불가 (View로 감싸기)

---

### Safe Area

#### 동등한 것 없음 → SAFEAREAVIEW
```javascript
// ❌ Readdy (웹)
// 동등한 것 없음 - 웹에는 노치/홈 표시기가 없음

<div className="min-h-screen bg-white">
  <div className="px-4 pt-12 pb-4">
    {/* 콘텐츠 */}
  </div>
</div>

// ✅ Frontend (React Native)
import { SafeAreaView } from 'react-native-safe-area-context';

<SafeAreaView className="flex-1 bg-white">
  <View className="px-4">
    {/* 콘텐츠가 자동으로 노치/홈 표시기를 피함 */}
  </View>
</SafeAreaView>
```

**Import**:
```javascript
import { SafeAreaView } from 'react-native-safe-area-context';
```

**사용 시기**:
- 최상위 화면 컴포넌트 감싸기
- 노치/상태바에 의해 콘텐츠가 숨겨지는 것을 방지
- iOS와 Android의 safe area를 자동으로 처리

**주의사항**:
- `react-native` 버전이 아닌 `react-native-safe-area-context` 사용
- 전체 화면 높이를 위해 `flex-1` 적용
- 여러 SafeAreaView를 중첩하지 마세요

---

## 3. 모달 & 오버레이 컴포넌트

### 모달

#### 커스텀 오버레이 div → MODAL
```javascript
// ❌ Readdy (웹)
{showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-sm">
      <h3>Modal Title</h3>
      <button onClick={() => setShowModal(false)}>Close</button>
    </div>
  </div>
)}

// ✅ Frontend (React Native)
<Modal
  visible={showModal}
  transparent={true}
  animationType="fade"
  onRequestClose={() => setShowModal(false)}
>
  <View className="flex-1 items-center justify-center bg-black/50">
    <View className="bg-white rounded-lg p-6 w-11/12">
      <Text className="text-lg font-bold">Modal Title</Text>
      <TouchableOpacity onPress={() => setShowModal(false)}>
        <Text>Close</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
```

**Import**: `import { Modal } from 'react-native';`

**Props**:
- `visible={boolean}` - 모달 표시/숨김
- `transparent={boolean}` - 투명 배경
- `animationType="none" | "slide" | "fade"` - 애니메이션 타입
- `onRequestClose={callback}` - **Android에서 필수**
- `presentationStyle="fullScreen" | "pageSheet" | "formSheet"` - iOS 전용

**주의사항**:
- `onRequestClose`는 Android에서 **필수**
- Android에서 뒤로 가기 버튼을 수동으로 처리해야 함
- `transparent={true}` 없이는 배경색이 작동하지 않음
- 반투명 오버레이에 `bg-black/50` 사용

---

## 4. 폼 컴포넌트

### Checkbox → 커스텀 컴포넌트 또는 Switch

```javascript
// ❌ Readdy (웹)
<input
  type="checkbox"
  checked={agreed}
  onChange={(e) => setAgreed(e.target.checked)}
/>

// ✅ Frontend (React Native) - 옵션 1: Switch
import { Switch } from 'react-native';

<Switch
  value={agreed}
  onValueChange={setAgreed}
  trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
  thumbColor={agreed ? '#FFFFFF' : '#F3F4F6'}
/>

// ✅ Frontend (React Native) - 옵션 2: 커스텀 Checkbox
<TouchableOpacity
  onPress={() => setAgreed(!agreed)}
  className="flex-row items-center"
>
  <View className={`w-5 h-5 border rounded ${agreed ? 'bg-blue-500' : 'bg-white'}`}>
    {agreed && <Icon name="checkmark" size={16} color="white" />}
  </View>
  <Text className="ml-2">I agree to terms</Text>
</TouchableOpacity>
```

**Import**: `import { Switch } from 'react-native';`

**주의사항**:
- 네이티브 checkbox 컴포넌트 없음
- Switch는 iOS/Android 토글 스위치
- 커스텀 checkbox는 수동 구현 필요
- iOS와 Android 간 스타일 차이

---

### Select/Dropdown → PICKER 또는 커스텀

```javascript
// ❌ Readdy (웹)
<select value={selected} onChange={(e) => setSelected(e.target.value)}>
  <option value="low">낮음</option>
  <option value="normal">보통</option>
  <option value="high">높음</option>
</select>

// ✅ Frontend (React Native) - 커스텀 버튼 Picker (Readdy에서)
<View className="flex-row space-x-1">
  {[
    { value: 'low', label: '낮음' },
    { value: 'normal', label: '보통' },
    { value: 'high', label: '높음' }
  ].map((option) => (
    <TouchableOpacity
      key={option.value}
      onPress={() => setSelected(option.value)}
      className={`px-2 py-1 rounded flex-1 ${
        selected === option.value
          ? 'bg-black'
          : 'bg-white border border-gray-300'
      }`}
    >
      <Text className={`text-xs font-medium text-center ${
        selected === option.value ? 'text-white' : 'text-gray-700'
      }`}>
        {option.label}
      </Text>
    </TouchableOpacity>
  ))}
</View>

// ✅ 대안: @react-native-picker/picker
import { Picker } from '@react-native-picker/picker';

<Picker
  selectedValue={selected}
  onValueChange={(value) => setSelected(value)}
>
  <Picker.Item label="낮음" value="low" />
  <Picker.Item label="보통" value="normal" />
  <Picker.Item label="높음" value="high" />
</Picker>
```

**권장사항**: 더 나은 UX를 위해 커스텀 버튼 기반 picker 사용 (Readdy처럼)

**주의사항**:
- 네이티브 `<Picker>` 스타일링이 제한적이고 플랫폼별
- 커스텀 버튼 picker가 더 나은 제어 제공
- 긴 옵션 리스트의 경우 모달 picker 고려

---

## 5. 아이콘 컴포넌트

### 아이콘 폰트 → React Native Vector Icons

```javascript
// ❌ Readdy (웹) - Remix Icon
<i className="ri-settings-3-line text-xl text-gray-700"></i>
<i className="ri-notification-3-line text-xl text-gray-700"></i>
<i className="ri-close-line text-xl"></i>

// ✅ Frontend (React Native) - Ionicons
import Icon from 'react-native-vector-icons/Ionicons';

<Icon name="settings-outline" size={24} color="#374151" />
<Icon name="notifications-outline" size={24} color="#374151" />
<Icon name="close-outline" size={24} color="#000000" />
```

**설치**:
```bash
npm install react-native-vector-icons
# iOS: cd ios && pod install
# Android: 자동 연결됨
```

**아이콘 매핑** (Remix Icon → Ionicons):
| Remix Icon | Ionicons | 설명 |
|------------|----------|-------------|
| `ri-settings-3-line` | `settings-outline` | 설정 기어 |
| `ri-notification-3-line` | `notifications-outline` | 벨 아이콘 |
| `ri-bank-card-line` | `card-outline` | 신용카드 |
| `ri-history-line` | `time-outline` | 시계/히스토리 |
| `ri-logout-box-line` | `log-out-outline` | 로그아웃 화살표 |
| `ri-login-box-line` | `log-in-outline` | 로그인 화살표 |
| `ri-close-line` | `close-outline` | X/닫기 |
| `ri-timer-line` | `timer-outline` | 타이머/스톱워치 |
| `ri-vip-crown-line` | `crown-outline` | 왕관 |
| `ri-checkmark-line` | `checkmark-outline` | 체크마크 |
| `ri-arrow-left-line` | `arrow-back-outline` | 뒤로 화살표 |
| `ri-arrow-right-line` | `arrow-forward-outline` | 앞으로 화살표 |

**사용 가능한 아이콘 세트**:
- Ionicons (권장 - iOS 스타일)
- MaterialIcons (Android 스타일)
- FontAwesome
- Feather
- AntDesign

**주의사항**:
- className이 아닌 아이콘 컴포넌트를 import해야 함
- 크기는 Tailwind 클래스가 아닌 숫자
- 색상은 hex/rgb 문자열
- 아이콘은 Text 색상 상속의 영향을 받지 않음

---

## 6. 이미지 컴포넌트

### IMG → IMAGE

```javascript
// ❌ Readdy (웹)
<img
  src="/assets/logo.png"
  alt="Logo"
  className="w-20 h-20 rounded-full"
/>

// ✅ Frontend (React Native)
import { Image } from 'react-native';

<Image
  source={require('../assets/images/logo.png')}
  className="w-20 h-20 rounded-full"
  resizeMode="cover"
/>

// 원격 이미지의 경우
<Image
  source={{ uri: 'https://example.com/image.png' }}
  className="w-20 h-20"
  resizeMode="cover"
/>
```

**Import**: `import { Image } from 'react-native';`

**주요 차이점**:
- `src` → `source`
- 로컬 이미지는 문자열이 아닌 `require()` 사용
- 원격 이미지는 `{ uri: 'url' }` 사용
- `alt` 지원 안 됨 (접근성은 `accessibilityLabel` 사용)

**Resize Modes**:
- `cover` - 컨테이너를 채우고 종횡비 유지 (자르기)
- `contain` - 컨테이너 안에 맞추고 종횡비 유지
- `stretch` - 컨테이너를 채우고 종횡비 무시
- `repeat` - 이미지 타일링
- `center` - 이미지를 중앙에 배치, 크기 조절 없음

**주의사항**:
- 너비와 높이를 모두 지정해야 함 (자동 크기 조절 없음)
- CSS `object-fit` 대신 `resizeMode` 사용
- 로컬 이미지는 번들에 있어야 함 (동적 require 불가)
- 동적 이미지의 경우 원격 URL 사용

---

## 7. 유틸리티 컴포넌트

### Fragment

```javascript
// ✅ 웹과 React Native 모두 동일
<>
  <Text>First</Text>
  <Text>Second</Text>
</>

// 또는
<React.Fragment>
  <Text>First</Text>
  <Text>Second</Text>
</React.Fragment>
```

---

### 조건부 렌더링

```javascript
// ✅ 웹과 React Native 모두 동일한 패턴

// && 연산자
{isLoggedIn && <Text>Welcome!</Text>}

// 삼항 연산자
{isLoggedIn ? <LoggedInView /> : <LoggedOutView />}

// 조기 반환
if (!isLoaded) {
  return <ActivityIndicator />;
}
return <MainContent />;
```

---

## 8. 스타일 패턴

### 인라인 스타일

```javascript
// ❌ Readdy (웹)
<div style={{ fontFamily: "Pacifico, serif" }}>
  Title
</div>

// ✅ Frontend (React Native)
<Text style={{ fontFamily: "Pacifico-Regular" }}>
  Title
</Text>
```

**주의사항**:
- 폰트 이름이 다름 (설치된 폰트 파일과 일치해야 함)
- 웹 폰트를 네이티브 프로젝트에 추가해야 함
- `fontFamily`, `fontWeight`, `fontSize`를 별도로 사용 (단축어 없음)

---

### ClassName + Style 결합

```javascript
// ✅ Frontend (React Native) - NativeWind + 인라인 스타일
<View className="flex-1 bg-white">
  <Text
    className="text-lg font-bold"
    style={{ fontFamily: "Pacifico-Regular" }}
  >
    Custom Font Title
  </Text>
</View>
```

**모범 사례**:
- 레이아웃과 간격에는 NativeWind `className` 사용
- 커스텀 폰트, 복잡한 애니메이션에는 인라인 `style` 사용
- 필요 시 둘 다 결합 (인라인 스타일이 className을 재정의)

---

## 9. 이벤트 핸들러

### 이벤트 매핑

| 웹 (Readdy) | React Native (Frontend) |
|--------------|-------------------------|
| `onClick` | `onPress` |
| `onChange` | `onChangeText` (TextInput) |
| `onSubmit` | 수동 처리 |
| `onFocus` | `onFocus` (동일) |
| `onBlur` | `onBlur` (동일) |
| `onMouseEnter` | ❌ 사용 불가 |
| `onMouseLeave` | ❌ 사용 불가 |
| `onKeyDown` | ❌ 사용 불가 |
| `onScroll` | `onScroll` (동일) |

**터치 이벤트**:
```javascript
<TouchableOpacity
  onPress={() => console.log('Pressed')}
  onPressIn={() => console.log('Press started')}
  onPressOut={() => console.log('Press ended')}
  onLongPress={() => console.log('Long pressed')}
  delayLongPress={500}
>
  <Text>Press Me</Text>
</TouchableOpacity>
```

---

## 10. 접근성

### 웹 접근성 → React Native 접근성

```javascript
// ❌ Readdy (웹)
<button aria-label="Close modal">
  <i className="ri-close-line"></i>
</button>

<input
  type="text"
  placeholder="Email"
  aria-required="true"
/>

// ✅ Frontend (React Native)
<TouchableOpacity
  accessibilityLabel="Close modal"
  accessibilityRole="button"
  accessible={true}
>
  <Icon name="close-outline" size={24} />
</TouchableOpacity>

<TextInput
  placeholder="Email"
  accessibilityLabel="Email input"
  accessibilityRequired={true}
/>
```

**주요 Props**:
- `accessible={true}` - 접근 가능한 요소로 표시
- `accessibilityLabel="..."` - 스크린 리더 레이블
- `accessibilityHint="..."` - 추가 컨텍스트
- `accessibilityRole="button|header|link|..."` - 의미론적 역할
- `accessibilityState={{ disabled: true }}` - 상태 정보

---

## 요약: 빠른 참조 표

| 요소 타입 | Readdy (웹) | Frontend (React Native) | Import |
|--------------|--------------|-------------------------|--------|
| 컨테이너 | `<div>` | `<View>` | `react-native` |
| 텍스트 | `<p>`, `<span>`, `<h1-h6>` | `<Text>` | `react-native` |
| 버튼 | `<button>` | `<TouchableOpacity>` | `react-native` |
| 입력 | `<input>` | `<TextInput>` | `react-native` |
| 링크 | `<Link to="...">` | `navigation.navigate()` | `@react-navigation/native` |
| 이미지 | `<img src="...">` | `<Image source={...}>` | `react-native` |
| 스크롤 | `<div>` with overflow | `<ScrollView>` | `react-native` |
| 리스트 | `.map()` | `<FlatList>` | `react-native` |
| 모달 | 커스텀 오버레이 | `<Modal>` | `react-native` |
| Checkbox | `<input type="checkbox">` | `<Switch>` 또는 커스텀 | `react-native` |
| Select | `<select>` | 커스텀 picker | N/A |
| 아이콘 | `<i className="ri-*">` | `<Icon name="*">` | `react-native-vector-icons` |
| Safe Area | N/A | `<SafeAreaView>` | `react-native-safe-area-context` |

---

## 모범 사례

1. **항상 텍스트를 `<Text>`로 감싸기** - 그렇지 않으면 React Native가 오류 발생
2. **버튼에 TouchableOpacity 사용** - 간단하고 잘 작동함
3. **긴 리스트에 FlatList 사용** - ScrollView보다 더 나은 성능
4. **SafeAreaView 구현** - 노치와 홈 표시기 처리
5. **벡터 아이콘 사용** - 확장 가능하고 플랫폼에 적합
6. **폼 수동 검증** - 네이티브 HTML5 검증 없음
7. **키보드 처리** - 폼에 `KeyboardAvoidingView` 사용
8. **두 플랫폼에서 테스트** - iOS와 Android에는 차이가 있음

---

*매핑 가이드 완료: 2025-10-23*
